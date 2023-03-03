import { User, Prisma } from '@prisma/client';

import { UserFeatures, UserInventory } from '@Database';

import AuthUtils from '@utils/AuthUtils';
import { UserGeneralSettingsValidation } from '@utils/validation/user';

import { AbstractGuild, UserDatabase, ShopItem } from '@models';
import { APIUser, Routes, PermissionFlagsBits } from 'discord-api-types/v10';

const guildKeyRegex = /^guilds:(\d{16,20})$/;

const defaultInventory = UserInventory.Flags.backgroundDefault | UserInventory.Flags.layoutDefault;

class UserController {
	public readonly apollo: Apollo;
	constructor(apollo: Apollo) {
		Object.defineProperty(this, 'apollo', { 
			value: apollo, 
			enumerable: false, 
			writable: false, 
		});
	}

	async fetch(userId: string, options: { cache: boolean } = { cache: true }) {
		if(options.cache) {
			return await this.apollo.redis.get(`users:${userId}`);
		}
        
		const user = await this.apollo.apis.discord.get(Routes.user(userId)) as APIUser;

		await this.apollo.redis.set(`users:${userId}`, user);
        
		return user;
	}

	async fetchDatabase(userId: string, select?: Prisma.UserSelect | null) {
		if(select?.profile) {
			select.profile = true;
			select.bio = true;

			delete select.profile;
		}

		if(select?.inventory) {
			select.inventory = true;
			console.log(select);
		}

		const data = (await this.apollo.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select,
		}) || {}) as User;

		return await this.format(data, select?.inventory);
	}

	async fetchGuilds(token: string, options: { filterByHasBot?: boolean, filterPermission?: bigint } = { filterByHasBot: true, filterPermission: PermissionFlagsBits.Administrator }) {
		token = AuthUtils.parseToken(token).access_token;

		const guilds = await this.apollo.apis.discord.get(Routes.userGuilds(), {
			auth: false,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then(async(guilds) => {
			if(options.filterPermission !== undefined) {
				guilds = (guilds as AbstractGuild[]).filter(guild => (BigInt(guild.permissions) & PermissionFlagsBits.Administrator) === PermissionFlagsBits.Administrator);
			}
			
			if(!options.filterByHasBot) return guilds;
			
			const guildsInCache = await this.apollo.redis.keys('guilds:*').then(keys => keys.filter(guildKeyRegex.test.bind(guildKeyRegex)).map(key => key.replace(guildKeyRegex, '$1')));

			return (guilds as AbstractGuild[]).filter(guild => guildsInCache.includes(guild.id));
		});

		return guilds;
	}

	async update(userId: string, { op, raw }: { op: 'general', raw: any }) {
		switch (op) {
			case 'general': {
				const currentData = await this.apollo.prisma.user.findUnique({
					where: {
						id: userId,
					},
				}) || {} as User;

				const data = UserGeneralSettingsValidation(raw, currentData);

				const newData = await this.apollo.prisma.user.upsert({
					where: {
						id: userId,
					},
					update: {
						...currentData as any,
						...data,
					},
					create: {
						id: userId,
						...data,
					},
				});

				return await this.format(newData);
			}
		}
	}

	async format(data: User, selectInventory = false) {
		return {
			flags: data.flags,
			last_daily_at: data.last_daily_at,
			luas: data.luas,
			xp: data.xp,
			premium_type: data.premium_type,
			premium_until: data.premium_until,
			features: new UserFeatures(data.features as bigint || 0n).toArray(),
			inventory: selectInventory ? await this.getItemsFromUserInventory(data.inventory) : undefined,
			profile: {
				background: (data.profile as any)?.background || 0,
				layout: (data.profile as any)?.layout || 1,
				bio: data.bio,
			},
		} as UserDatabase;
	}

	async getItemsFromUserInventory(userInventory: number[]): Promise<ShopItem[]> {
		const items = await this.apollo.prisma.shopItem.findMany({
			where: {
				id: {
					in: [0, 1, ...userInventory],
				},
			},
		});

		return items as any as ShopItem[];
	}
}

export default UserController;
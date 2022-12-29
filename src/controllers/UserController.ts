import { User } from '@prisma/client';

import { UserFeatures, UserInventory } from '@Database';

import AuthUtils from '@utils/AuthUtils';
import { UserGeneralSettingsValidation } from '@utils/validation/user';

import { AbstractGuild, UserDatabase } from '@models';
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

	async fetchDatabase(userId: string) {
		const data = await this.apollo.prisma.user.findUnique({
			where: {
				id: userId,
			},
		}) || {} as User;

		return this.format(data);
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
						...currentData,
						...data,
					},
					create: {
						id: userId,
						...data,
					},
				});

				return this.format(newData);
			}
		}
	}

	format(data: User) {
		return {
			bio: data.bio,
			flags: data.flags,
			last_daily_at: data.last_daily_at,
			luas: data.luas,
			xp: data.xp,
			premium_type: data.premium_type,
			premium_until: data.premium_until,
			features: new UserFeatures(data.features as bigint || 0n).toArray(),
			inventory: {
				owned: new UserInventory(data.inventory || defaultInventory).toItemsArray(),
				using: new UserInventory(data.inventory_using || defaultInventory).ids,
			},
		} as UserDatabase;
	}
}

export default UserController;
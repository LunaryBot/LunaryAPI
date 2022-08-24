import { Guild } from '@models';

import AuthUtils from '@utils/AuthUtils';

import { APIUser, Routes, PermissionFlagsBits } from 'discord-api-types/v10';

const guildKeyRegex = /^guilds:(\d{16,20})$/;
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

	async fetchGuilds(token: string, options: { filterHasBot?: boolean, filterPermission?: bigint } = { filterHasBot: true, filterPermission: PermissionFlagsBits.Administrator }) {
		token = AuthUtils.parseToken(token).access_token;

		const guilds = await this.apollo.apis.discord.get(Routes.userGuilds(), {
			auth: false,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then(async(guilds) => {
			if(options.filterPermission !== undefined) {
				guilds = (guilds as Guild[]).filter(guild => (BigInt(guild.permissions) & PermissionFlagsBits.Administrator) === PermissionFlagsBits.Administrator);
			}
			
			if(!options.filterHasBot) return guilds;
			
			const guildsInCache = await this.apollo.redis.keys('guilds:*').then(keys => keys.filter(guildKeyRegex.test.bind(guildKeyRegex)).map(key => key.replace(guildKeyRegex, '$1')));

			return (guilds as Guild[]).filter(guild => guildsInCache.includes(guild.id));
		});


		return guilds;
	}
}

export default UserController;
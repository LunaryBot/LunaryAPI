import { APIUser, Routes } from 'discord-api-types/v10';

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
}

export default UserController;
class GuildController {
	public readonly apollo: Apollo;
	constructor(apollo: Apollo) {
		Object.defineProperty(this, 'apollo', { 
			value: apollo, 
			enumerable: false, 
			writable: false, 
		});
	}

	async fetch(guildId: string) {
		return await this.apollo.redis.get(`guilds:${guildId}`);
	}
}

export default GuildController;
import { Guild } from '@prisma/client';

import { GuildGeneralSettingsValidation } from '@validation';

import GuildFeatures from '@utils/GuildFeatures';

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

	async update(guildId: string, { op, data }: { op: 'moderation', data: any }) {
		const currentData = await this.apollo.prisma.guild.findUnique({
			where: {
				id: guildId,
			},
		}) || {} as Guild;

		switch (op) {
			case 'moderation': {
				const raw = GuildGeneralSettingsValidation(data, currentData);

				console.log(raw, { ...raw, features: new GuildFeatures(raw.features as bigint || 0n).toArray(), id: guildId });

				return { ...raw, features: new GuildFeatures(raw.features as bigint || 0n).toArray(), id: guildId };
			}
		}
	}
}

export default GuildController;
import { Guild, Prisma, PrismaPromise } from '@prisma/client';

import { GuildGeneralSettingsValidation, GuildPermissionsValidation } from '@validation';

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

	async update(guildId: string, { op, raw }: { op: 'moderation' | 'permissions', raw: any }) {
		switch (op) {
			case 'moderation': {
				const currentData = await this.apollo.prisma.guild.findUnique({
					where: {
						id: guildId,
					},
				}) || {} as Guild;

				const data = GuildGeneralSettingsValidation(raw, currentData);

				return { ...data, features: new GuildFeatures(data.features as bigint || 0n).toArray(), id: guildId };
			}

			case 'permissions': {
				const data = GuildPermissionsValidation(raw, guildId);

				const ids = data.map(({ id }) => id);

				const currentData = await this.apollo.prisma.guildPermissions.findMany({
					where: {
						guild_id: guildId,
					},
				});

				const deleteIds = currentData.filter(({ id }) => !ids.includes(id)).map(({ id }) => id);

				const args: PrismaPromise<any>[] = [];

				if(deleteIds.length) {
					args.push(this.apollo.prisma.guildPermissions.deleteMany({
						where: {
							id: {
								in: deleteIds,
							},
							guild_id: guildId,
						},
					}));
				}

				data.forEach(permissions => {
					args.push(this.apollo.prisma.guildPermissions.upsert({
						where: {
							guild_id_id: {
								guild_id: guildId,
								id: permissions.id,
							},
						},
						create: { ...permissions, guild_id: guildId },
						update: permissions,
					}));
				});

				this.apollo.prisma.$transaction(args);

				return JSON.parse(JSON.stringify(data, (k, v) => typeof v == 'bigint' ? Number(v) : v));
			}
		}
	}
}

export default GuildController;
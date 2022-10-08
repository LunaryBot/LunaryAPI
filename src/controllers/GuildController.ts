import { EmbedType, Guild, PrismaPromise, Embed as DatabaseEmbed } from '@prisma/client';

import { GuildEmbedValidation, GuildGeneralSettingsValidation, GuildPermissionsValidation } from '@validation';

import ApiError from '@utils/ApiError';
import GuildFeatures from '@utils/GuildFeatures';

import { Embed } from '@types';

const embedTypes = Object.keys(EmbedType);

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

	async fetchEmbed(guildId: string, type?: EmbedType) {
		const data = await this.apollo.prisma.embed.findMany({
			where: {
				guild_id: guildId,
				type,
			},
		});

		return data as Embed[];
	}

	async update(guildId: string, { op, raw }: { op: 'moderation' | 'permissions' | 'embeds', raw: any }) {
		switch (op) {
			case 'moderation': {
				const currentData = await this.apollo.prisma.guild.findUnique({
					where: {
						id: guildId,
					},
				}) || {} as Guild;

				const data = GuildGeneralSettingsValidation(raw, currentData);

				await this.apollo.prisma.guild.upsert({
					where: {
						id: guildId,
					},
					create: { ...data, id: guildId },
					update: data,
				});

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

				await this.apollo.prisma.$transaction(args);

				return JSON.parse(JSON.stringify(data, (k, v) => typeof v == 'bigint' ? Number(v) : v));
			}

			case 'embeds': {
				const { type, ...embed } = raw as Omit<DatabaseEmbed, 'guild_id'>;

				if(!embedTypes.includes(type)) {
					throw new ApiError('Invalid embed type');
				}

				if(embed == null || embed == undefined) {
					try {
						await this.apollo.prisma.embed.delete({
							where: {
								guild_id_type: {
									guild_id: guildId,
									type,
								},
							},
						});
					} catch (_) {
						throw new ApiError('Unknown Embed', 204);
					} finally {
						return true;
					}
				}

				const data = GuildEmbedValidation(embed);

				return await this.apollo.prisma.embed.upsert({
					where: {
						guild_id_type: {
							guild_id: guildId,
							type,
						},
					},
					create: {
						guild_id: guildId,
						type,
						...data,
					},
					update: data,
				});
			}
		}
	}
}

export default GuildController;
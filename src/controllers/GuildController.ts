import { EmbedType, Guild, PrismaPromise, Embed as DatabaseEmbed, Reason as DatabaseReason, Prisma } from '@prisma/client';

import { GuildFeatures } from '@Database';

import { GuildEmbedValidation, GuildGeneralSettingsValidation, GuildPermissionsValidation, GuildReasonsValidation } from '@validation';

import ApiError from '@utils/ApiError';

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

	fetch(guildId: string) {
		return this.apollo.redis.get(`guilds:${guildId}`);
	}

	fetchEmbed(guildId: string, type?: EmbedType) {
		return this.apollo.prisma.embed.findMany({
			where: {
				guild_id: guildId,
				type,
			},
		}) as Promise<Embed[]>;
	}

	fetchReasons(guildId: string) {
		return this.apollo.prisma.reason.findMany({
			where: {
				guild_id: guildId,
			},
		});
	}

	async update(guildId: string, { op, raw }: { op: 'moderation' | 'permissions' | 'embeds' | 'reasons', raw: any }, { replacePermissions }: { replacePermissions?: boolean } = {}) {
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
				const data = GuildPermissionsValidation(raw);

				const ids = data.map(({ id }) => id);

				const currentData = await this.apollo.prisma.guildPermissions.findMany({
					where: {
						guild_id: guildId,
					},
				});

				const deleteIds = currentData.filter(({ id }) => !ids.includes(id)).map(({ id }) => id);

				const args: PrismaPromise<any>[] = [];

				if(deleteIds.length && replacePermissions) {
					args.push(this.apollo.prisma.guildPermissions.deleteMany({
						where: {
							id: {
								in: deleteIds,
							},
							guild_id: guildId,
						},
					}));
				}

				data.forEach(({ id, type, permissions }) => args.push(this.apollo.prisma.guildPermissions.upsert({
					where: {
						guild_id_id: {
							guild_id: guildId,
							id,
						},
					},
					create: {
						type, 
						permissions, 
						id,
						Guild: {
							connectOrCreate: {
								where: {
									id: guildId,
								},
								create: {
									id: guildId,
								},
							},
						},
					},
					update: { 
						permissions,
						Guild: {
							connectOrCreate: {
								where: {
									id: guildId,
								},
								create: {
									id: guildId,
								},
							},
						}, 
					},
				})));

				await Promise.all(args);

				console.log('a');

				return JSON.parse(JSON.stringify(data, (k, v) => typeof v == 'bigint' ? Number(v) : v));
			}

			case 'embeds': {
				const { type, ...embed } = raw as Omit<DatabaseEmbed, 'guild_id'>;

				if(!embedTypes.includes(type)) {
					throw new ApiError('Invalid embed type');
				}

				if(Object.keys(embed).length <= 0) {
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

			case 'reasons': {
				const data = GuildReasonsValidation(raw);

				const ids = data.map(({ id }) => id);

				const currentData = await this.apollo.prisma.reason.findMany({
					where: {
						guild_id: guildId,
					},
				});
				
				const deleteReasons = currentData.filter(({ id }) => !ids.includes(id));

				// console.log(ids, deleteReasons);

				const args: PrismaPromise<any>[] = [];

				if(deleteReasons.length) {
					args.push(this.apollo.prisma.reason.deleteMany({
						where: {
							id: {
								in: deleteReasons.map(({ id }) => id),
							},
							guild_id: guildId,
						},
					}));

					deleteReasons.forEach(reason => {
						args.push(this.apollo.controllers.punishments.updateManyReasons(reason.id, reason.text));
					});
				}

				data.forEach(reason => {
					args.push(this.apollo.prisma.reason.upsert({
						where: {
							guild_id_id: {
								guild_id: guildId,
								id: reason.id ?? -1,
							},
						},
						create: { ...reason, guild_id: guildId },
						update: reason,
					}));
				});

				const response = await this.apollo.prisma.$transaction(args);

				return response.filter(arg => typeof arg.count == 'undefined');
			}
		}
	}
}

export default GuildController;
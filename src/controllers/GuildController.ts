import { EmbedType, Guild, PrismaPromise, Embed as DatabaseEmbed, Reason, Prisma, GuildPermissions } from '@prisma/client';

import { GuildFeatures } from '@Database';

import { GuildEmbedValidation, GuildGeneralSettingsValidation, GuildPermissionsValidation, GuildReasonsValidation } from '@validation';

import ApiError from '@utils/ApiError';

import { GuildDatabaseInput } from '@inputs';
import { GuildDatabase } from '@models';
import { Embed } from '@types';

type GuildSelect = Prisma.GuildSelect & {
	embeds?: boolean,
	permissions?: boolean,
	reasons?: boolean,
}

interface FullGuildDatabase extends Guild {
	embeds?: Embed[],
	permissions?: GuildPermissions[],
	reasons?: Reason[],
}

const guildDatabaseSpecialKeys = ['embeds', 'permissions', 'reasons'];

const acceptEmbedTypes = Object.keys(EmbedType);

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

	async fetchDatabase(guildId: string, select?: GuildSelect | null, _data?: FullGuildDatabase) {
		const selectEmbeds = !!select?.embeds;
		const selectPermissions = !!select?.permissions;
		const selectReasons = !!select?.reasons;

		delete select?.embeds;
		delete select?.permissions;
		delete select?.reasons;

		const data = (Object.keys(select || {}).length > 0
			? await this.apollo.prisma.guild.findUnique({
				where: {
					id: guildId,
				},
				select,
			})
			: undefined) as FullGuildDatabase || {} as FullGuildDatabase;

		if(selectEmbeds) {
			data.embeds = await this.apollo.prisma.embed.findMany({
				where: {
					guild_id: guildId,
				},
			}) as Embed[];
		}

		if(selectReasons) {
			data.reasons = await this.apollo.prisma.reason.findMany({
				where: {
					guild_id: guildId,
				},
			});
		}

		if(selectPermissions) {
			data.permissions = await this.apollo.prisma.guildPermissions.findMany({
				where: {
					guild_id: guildId,
				},
			});
		}

		return this.format({ ...data, ...(_data || {}) });
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

	async _update(guildId: string, raw: GuildDatabaseInput, select: GuildSelect | undefined = undefined, options: { replacePermissions?: boolean, replaceEmebeds?: boolean } = {}) {
		let returnData = {} as FullGuildDatabase;
		
		if(Object.keys(raw).find(key => !guildDatabaseSpecialKeys.includes(key))) {
			const currentData = await this.apollo.prisma.guild.findUnique({
				where: {
					id: guildId,
				},
			}) || {} as Guild;

			const data = GuildGeneralSettingsValidation(raw as any, currentData);

			const d = await this.apollo.prisma.guild.upsert({
				where: {
					id: guildId,
				},
				create: { ...data, id: guildId },
				update: data,
				select: Object.fromEntries(Object.entries(select || {}).filter(([key]) => !guildDatabaseSpecialKeys.includes(key)).map(([key, value]) => ([key, value]))),
			});

			returnData = { ...returnData, ...d };

			select = Object.fromEntries(Object.entries(select || {}).filter(([key]) => guildDatabaseSpecialKeys.includes(key)).map(([key, value]) => ([key, value])));
		}

		if(raw.permissions) {
			const data = GuildPermissionsValidation(raw.permissions);

			const ids = data.map(({ id }) => id);

			const currentData = await this.apollo.prisma.guildPermissions.findMany({
				where: {
					guild_id: guildId,
				},
			});

			const deleteIds = currentData.filter(({ id }) => !ids.includes(id)).map(({ id }) => id);

			const args: PrismaPromise<any>[] = [];

			if(deleteIds.length && options.replacePermissions === false) {
				args.push(this.apollo.prisma.guildPermissions.deleteMany({
					where: {
						id: {
							in: deleteIds,
						},
						guild_id: guildId,
					},
				}));
			}

			const connectOrCreate = {
				where: {
					id: guildId,
				},
				create: {
					id: guildId,
				},
			};

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
					Guild: { connectOrCreate },
				},
				update: { 
					permissions,
					Guild: { connectOrCreate }, 
				},
			})));

			const d = await Promise.all(args);

			returnData = { ...returnData, permissions: JSON.parse(JSON.stringify(d, (k, v) => typeof v == 'bigint' ? Number(v) : v)) };

			delete select?.permissions;
		}

		if(raw.embeds) {
			const embedTypes = await this.apollo.prisma.embed.findMany({
				where: {
					guild_id: guildId,
				},
				select: {
					type: true,
				},
			}).then(embeds => embeds.map(embed => embed.type));

			const deleteEmbeds: EmbedType[] = options.replaceEmebeds !== false ? embedTypes.filter(type => !raw.embeds.find(({ type: _type }) => type === _type)) : [];

			const args: PrismaPromise<any>[] = [];

			raw.embeds.forEach(_embed => {
				const { type, ...embed } = _embed as Omit<DatabaseEmbed, 'guild_id'>;

				if(!acceptEmbedTypes.includes(type)) {
					return;

					// throw new ApiError('Invalid embed type');
				}

				if(Object.keys(embed).length <= 0 && embedTypes.includes(type)) {
					return deleteEmbeds.push(type);
				}

				const data = GuildEmbedValidation(embed);

				args.push(this.apollo.prisma.embed.upsert({
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
				}));
			});

			if(deleteEmbeds.length) {
				args.push(this.apollo.prisma.embed.deleteMany({
					where: {
						type: {
							in: deleteEmbeds,
						},
						guild_id: guildId,
					},
				}));
			}

			const response = await this.apollo.prisma.$transaction(args);

			returnData = { ...returnData, embeds: response.filter(arg => typeof arg.count == 'undefined') };

			delete select?.embeds;
		}
		
		if(raw.reasons) {
			const data = GuildReasonsValidation(raw.reasons);

			const ids = data.map(({ id }) => id);

			const currentData = await this.apollo.prisma.reason.findMany({
				where: {
					guild_id: guildId,
				},
				select: {
					id: true,
					text: true,
				},
			});
			
			const reasonsIds = currentData.map(reason => reason.id);
				
			const deleteReasons = currentData.filter(({ id }) => !ids.includes(id));

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
				if(reason.id && !reasonsIds.includes(reason.id)) {
					delete reason.id;
				}

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

			returnData = { ...returnData, reasons: response.filter(arg => typeof arg.count == 'undefined') };

			delete select?.reasons;
		}

		return this.fetchDatabase(guildId, select, returnData);
	}

	async update(guildId: string, { op, raw }: { op: 'moderation' | 'permissions' | 'embeds' | 'reasons', raw: any }, select: GuildSelect | undefined, { replacePermissions }: { replacePermissions?: boolean } = {}) {
		switch (op) {
			case 'moderation': {
				const currentData = await this.apollo.prisma.guild.findUnique({
					where: {
						id: guildId,
					},
				}) || {} as Guild;

				const data = GuildGeneralSettingsValidation(raw, currentData);

				const newData = await this.apollo.prisma.guild.upsert({
					where: {
						id: guildId,
					},
					create: { ...data, id: guildId },
					update: data,
					select: Object.fromEntries(Object.entries(select || {}).filter(([key]) => !guildDatabaseSpecialKeys.includes(key)).map(([key, value]) => ([key, value]))),
				});

				return this.fetchDatabase(guildId, Object.fromEntries(Object.entries(select || {}).filter(([key]) => guildDatabaseSpecialKeys.includes(key)).map(([key, value]) => ([key, value]))), newData as FullGuildDatabase);
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

				const connectOrCreate = {
					where: {
						id: guildId,
					},
					create: {
						id: guildId,
					},
				};

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
						Guild: { connectOrCreate },
					},
					update: { 
						permissions,
						Guild: { connectOrCreate }, 
					},
				})));

				const newData = await Promise.all(args);

				console.log(newData);

				return this.fetchDatabase(guildId, Object.fromEntries(Object.entries(select || {}).filter(([key]) => key !== 'permissions').map(([key, value]) => ([key, value]))), { permissions: JSON.parse(JSON.stringify(newData, (k, v) => typeof v == 'bigint' ? Number(v) : v)) } as FullGuildDatabase);
			}

			case 'embeds': {
				const { type, ...embed } = raw as Omit<DatabaseEmbed, 'guild_id'>;

				if(!acceptEmbedTypes.includes(type)) {
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

				await this.apollo.prisma.embed.upsert({
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

				return this.fetchDatabase(guildId, select);
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

				return this.fetchDatabase(guildId, Object.fromEntries(Object.entries(select || {}).filter(([key]) => key !== 'reasons').map(([key, value]) => ([key, value]))), { reasons: response.filter(arg => typeof arg.count == 'undefined') } as FullGuildDatabase);
			}
		}
	}

	format(data: FullGuildDatabase) {
		return {
			features: data.features ? new GuildFeatures(data.features).toArray() : [],
			modlogs_channel: data.modlogs_channel,
			punishments_channel: data.punishments_channel,
			embeds: data.embeds || [],
			permissions: data.permissions ? JSON.parse(JSON.stringify(data.permissions, (k, v) => typeof v == 'bigint' ? Number(v) : v)) : [],
			reasons: data.reasons || [],
			premium_type: data.premium_type,
			premium_until: data.premium_until,
		} as GuildDatabase;
	}
}

export default GuildController;
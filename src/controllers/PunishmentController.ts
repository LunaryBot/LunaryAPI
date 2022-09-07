import { Prisma, PunishmentType, REASONS } from '@prisma/client';

import { AbstractGuild } from '@models';

import { Utils } from '@utils/Utils';

import { PunishmentFilter } from '../@types';
import { APIGuild, APIUser } from 'discord-api-types/v10';


const punishmentTypes = Object.keys(PunishmentType);

const maxTake = 25;
const defaultTake = 20;

class PunishmentController {
	public readonly apollo: Apollo;
	constructor(apollo: Apollo) {
		Object.defineProperty(this, 'apollo', { 
			value: apollo, 
			enumerable: false, 
			writable: false, 
		});
	}

	async fetch(filter: PunishmentFilter = {}) {
		const take = filter.limit ? (filter.limit > maxTake ? maxTake : filter.limit) : defaultTake;

		const punishments = await this.apollo.prisma.pUNISHMENTS.findMany({
			orderBy: {
				created_at: 'desc',
			},
			where: {
				deleted: false,
				...this.where(filter),
			},
			take,
		}).then(async punishments => {
			const users: string[] = [];
		    const guilds: string[] = [];
			const reasonsIds: string[] = [];

			punishments.forEach(punishment => {
				([punishment.user_id, punishment.author_id]).forEach(user => !users.includes(user) && users.push(user));
				!guilds.includes(punishment.guild_id) && guilds.push(punishment.guild_id);
				punishment.reason_id && !reasonsIds.includes(punishment.reason_id) && reasonsIds.push(punishment.reason_id);
			});
            
			const resolved = {
				users: await Promise.all<APIUser>(users.map((userId: any) => this.apollo.redis.get(`users:${userId}`) as any)),
				guilds: (await Promise.all<Partial<APIGuild>>(guilds.map(async(guildId: any) => await this.apollo.redis.get(`guilds:${guildId}`).catch(() => ({ id: guildId })) as any))).map((guild) => ({
					name: guild.name || 'Unknown',
					icon: guild.icon,
					id: guild.id as string,
					features: guild.features || [],
				} as AbstractGuild)),
				reasons: reasonsIds.length
					? await this.apollo.prisma.rEASONS.findMany({
						where: {
							id: {
								in: reasonsIds,
							},
						},
					})
					: [],
			};

			return punishments.map(punishment => {
				const reason = resolved.reasons.find(({ id }) => id == punishment.reason_id);
				
				const data = {
					...punishment,
					id: Utils.formatHumanPunishmentId(punishment.id),
					user: resolved.users.find(user => user.id === punishment.user_id) as APIUser,
					author: resolved.users.find(user => user.id === punishment.author_id) as APIUser,
					guild: resolved.guilds.find(guild => guild.id === punishment.guild_id) as AbstractGuild,
				} as any;

				if(reason || punishment.reason) {
					data.reason = {
						text: reason?.text || punishment.reason,
					};

					if(reason?.id) data.reason.id = reason?.id;
				}

                // @ts-ignore
				delete data.user_id;

                // @ts-ignore
				delete data.author_id;

                // @ts-ignore
				delete data.guild_id;

				return data; 
			});
		});

		return punishments;
	}

	private where(filter: PunishmentFilter = {}) {
		const where = {} as any;

		if(filter.userId) where.user_id = filter.userId;
        
		if(filter.authorId) where.author_id = filter.authorId;

		if(filter.guildId) where.guild_id = filter.guildId;

		if(filter.type) {
			const types = [ ...(Array.isArray(filter.type) ? filter.type : [filter.type]).filter(type => punishmentTypes.includes(type)) ];
			
			if(types.length > 0) where.type = { in: types };
		}

		if(filter.before || filter.after) {
			where.created_at = {};

			if(filter.before) where.created_at.lt = filter.before;
            
			if(filter.after) where.created_at.gte = filter.before;
		}

		return where;
	}
}

export default PunishmentController;
import { Constants } from 'eris';
import { Resolver, Query, Arg, Mutation, ResolverData, Ctx } from 'type-graphql';

import Punishment from '../models/Punishment';
import { PunishmentModifyInput } from '../models/Inputs'

import Utils from '../utils/Utils';
import ApiError from '../utils/ApiError';

import { IPunishmentLog, IPunishmentLogsFilter } from '../@types';
import authChecker from '../utils/AuthChecker';
import { MyContext } from '../@types/Server';

const nullable = { nullable: true };

const { Permissions } = Constants;

@Resolver()
class PunishmentsResolver {
    @Query(() => [Punishment])
    async Punishments(
        @Arg('user', nullable) userId: string,
        @Arg('author', nullable) authorId: string,
        @Arg('type', nullable) type: 1 | 2 | 3 | 4,
        @Arg('afterTimestamp', nullable) afterTimestamp: number,
        @Arg('beforeTimestamp', nullable) beforeTimestamp: number,
    ) {
        const logs = await global.dbs.getPunishmentLogs()

        const filters: IPunishmentLogsFilter = { userId, authorId, type, afterTimestamp, beforeTimestamp };

        if(filters?.limit) {
            filters.limit = Number(filters.limit);
        }

        if(filters?.type) {
            filters.type = Number(filters.type) as 1 | 2 | 3 | 4 ?? filters.type;
        }

        try {
            const resolvedPunishmentLogs = await Utils.resolvePunishmentLogs(logs, filters);

            return resolvedPunishmentLogs;
        } catch (err: any) {
            console.log(err.message);
            throw new ApiError('Internal Server Error', 500);
        }
    }

    @Query(() => Punishment)
    async Punishment( @Arg('id') punishmentId: string ) {
        punishmentId = punishmentId.replace(/#?([A-Z](\d{6}))/i, '$1').toUpperCase();

        const log = await dbs.getPunishmentLog(punishmentId);

        if(!log) throw new ApiError('Unknown Punishment', 404);

        try {
            const resolvedPunishmentLogs = await Utils.resolvePunishmentLogs({ [punishmentId]: log });

            return resolvedPunishmentLogs[0];
        } catch (err: any) {
            console.log(err.message);
            throw new ApiError('Internal Server Error', 500);
        }
    }
    
    @Mutation(() => Punishment)
    async PunishmentModify( @Arg('id') punishmentId: string, @Arg('data') data: PunishmentModifyInput, @Ctx() context: MyContext ) {
        punishmentId = punishmentId.replace(/#?([A-Z](\d{6}))/i, '$1').toUpperCase();
        
        const log = await dbs.getPunishmentLog(punishmentId);

        await PunishmentsResolver.verifyGuildPermissions(log, context);

        if(log.type !== 4) throw new ApiError(`Editing for this type (${log.type}) of punishment is not supported`, 415);
        
        log.reason = data.reason;

        try {
            dbs.setPunishmentLog(punishmentId, { reason: data.reason } as IPunishmentLog);

            const resolvedPunishmentLogs = await Utils.resolvePunishmentLogs({ [punishmentId]: log });

            return resolvedPunishmentLogs[0];
        } catch (err: any) {
            console.log(err.message);
            throw new ApiError('Internal Server Error', 500);
        }
    }

    @Mutation(() => Punishment)
    async PunishmentDelete( @Arg('id') punishmentId: string, @Ctx() context: MyContext ) {
        punishmentId = punishmentId.replace(/#?([A-Z](\d{6}))/i, '$1').toUpperCase();
        
        const log = await dbs.getPunishmentLog(punishmentId);

        await PunishmentsResolver.verifyGuildPermissions(log, context);

        try {
            dbs.deletePunishmentLog(punishmentId);

            const resolvedPunishmentLogs = await Utils.resolvePunishmentLogs({ [punishmentId]: log });

            return resolvedPunishmentLogs[0];
        } catch (err: any) {
            console.log(err.message);
            throw new ApiError('Internal Server Error', 500);
        }
    }

    static async verifyGuildPermissions(log: IPunishmentLog, context: MyContext): Promise<boolean> {
        if(log) {
            const { guild: guildId } = log || {};

            return authChecker({ context: { ...context, guildId } } as any, [Permissions.administrator])
        } else throw new ApiError('Unknown Punishment', 404);
    }
}

export default PunishmentsResolver;
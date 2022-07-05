import { Resolver, Query, Arg, FieldResolver, Mutation } from 'type-graphql';
import axios, { AxiosResponse } from 'axios';

import User from '../models/User';
import Guild from '../models/Guild'
import { GuildResponse } from '../models/Responses';
import Punishment, { PunishmentData } from '../models/Punishment';
import { PunishmentModifyInput } from '../models/Inputs'

import Utils from '../utils/Utils';
import ApiError from '../utils/ApiError';

import { IPunishmentLog, IPunishmentLogsFilter } from '../@types';

const nullable = { nullable: true };

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
        const logs = await dbs.getPunishmentLogs();

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
        const log = await dbs.getPunishmentLog(punishmentId);

        if(!log) throw new ApiError('Unknown Punishment', 404);

        punishmentId = punishmentId.replace(/#?([A-Z](\d{6}))/i, '$1').toUpperCase();

        try {
            const resolvedPunishmentLogs = await Utils.resolvePunishmentLogs({ [punishmentId]: log });

            return resolvedPunishmentLogs[0];
        } catch (err: any) {
            console.log(err.message);
            throw new ApiError('Internal Server Error', 500);
        }
    }
    
    @Mutation(() => Punishment, { name: 'Punishment' })
    async PunishmentModify( @Arg('id') punishmentId: string, @Arg('data') data: PunishmentModifyInput ) {
        punishmentId = punishmentId.replace(/#?([A-Z](\d{6}))/i, '$1').toUpperCase();
        
        const log = await dbs.getPunishmentLog(punishmentId);

        if(!log) throw new ApiError('Unknown Punishment', 404);

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
}

export default PunishmentsResolver;
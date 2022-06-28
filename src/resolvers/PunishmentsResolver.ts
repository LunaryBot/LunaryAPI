import { Resolver, Query, Arg, FieldResolver } from 'type-graphql';
import axios, { AxiosResponse } from 'axios';

import User from '../models/User';
import Guild from '../models/Guild'
import { GuildResponse } from '../models/Responses';
import Punishment, { PunishmentsFilter } from '../models/Punishment';

import Utils from '../utils/Utils';

import { IPunishmentLogsFilter } from '../@types';

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
        }
    }
}

export default PunishmentsResolver;
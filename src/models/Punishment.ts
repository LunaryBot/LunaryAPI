import { Field, ID, ObjectType } from 'type-graphql';

import User from './User';
import Guild from './Guild';

import { IPunishmentLog, IPunishmentLogResolved, IPunishmentLogsFilter } from '../@types';

const nullable = { nullable: true };

@ObjectType()
class Punishment implements IPunishmentLogResolved {
    @Field()
    type: 1 | 2 | 3 | 4;

    @Field(nullable)
    duration?: number;

    @Field()
    id: string;

    @Field(nullable)
    reason?: string;

    @Field()
    timestamp: number;

    @Field()
    user: User;

    @Field()
    author: User;

    @Field()
    guild: Guild;
}

@ObjectType()
class PunishmentData implements IPunishmentLog {
    @Field()
    type: 1 | 2 | 3 | 4;

    @Field(nullable)
    duration?: number;

    @Field()
    id: string;

    @Field(nullable)
    reason?: string;

    @Field()
    timestamp: number;

    @Field()
    user: string;

    @Field()
    author: string;

    @Field()
    guild: string;
}

@ObjectType()
class PunishmentsFilter implements IPunishmentLogsFilter {
    @Field(nullable)
    type: 1 | 2 | 3 | 4;

    @Field(nullable)
    afterTimestamp?: number;

    @Field(nullable)
    authorId?: string;

    @Field(nullable)
    beforeTimestamp?: number;

    @Field(nullable)
    guildId?: string;

    @Field(nullable)
    limit?: number;

    @Field(nullable)
    userId?: string;
}

export default Punishment;

export { PunishmentsFilter, PunishmentData };
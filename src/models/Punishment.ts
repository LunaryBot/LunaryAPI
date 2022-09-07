import { PUNISHMENTS, PunishmentType, REASONS } from '@prisma/client';
import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

import { AbstractGuild } from './guild';
import { User } from './User';

const nullable = { nullable: true };

@ObjectType()
class Punishment implements Omit<PUNISHMENTS, 'author_id' | 'user_id' | 'guild_id' | 'id' | 'reason_id' | 'reason'> {
    @Field(type => Date)
    	created_at: Date;

    @Field(type => Boolean)
    @UseMiddleware(DefaultValue(false))
    	deleted: boolean | null;

    @Field(type => Number, nullable)
    	duration: number | null;

    @Field(type => ID)
    	id: string;
    
    @Field(type => ReasonFormated, nullable)
    	reason: ReasonFormated | null;

    @Field()
    	type: PunishmentType;

    @Field(type => Number)
    	flags: bigint;

    @Field(type => User)
    	user: User;

    @Field(type => User)
    	author: User;

    @Field(type => AbstractGuild)
    	guild: AbstractGuild;
}

@ObjectType()
class ReasonFormated implements REASONS {
    @Field(type => Number, nullable)
    	days: number | null;
        
    @Field(type => Number, nullable)
    	duration: number | null;

    @Field(nullable)
    	guild_id: string;

    @Field(nullable)
    	id: string;

    @Field()
    	text: string;

    @Field(type => [String])
    @UseMiddleware(DefaultValue([]))
    	keys: string[];

    @Field(type => [String], nullable)
    	type: PunishmentType[];
}

export { Punishment };
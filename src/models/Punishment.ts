import { PUNISHMENTS, PunishmentType } from '@prisma/client';
import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

import { AbstractGuild } from './guild';
import { User } from './User';

const nullable = { nullable: true };

@ObjectType()
class Punishment implements Omit<PUNISHMENTS, 'author_id' | 'user_id' | 'guild_id'> {
    @Field(type => Date)
    	created_at: Date;

    @Field(type => Boolean)
    @UseMiddleware(DefaultValue(false))
    	deleted: boolean | null;

    @Field(type => Number, nullable)
    	duration: number | null;

    @Field(type => ID)
    	id: number;
    
    @Field(type => String, nullable)
    	reason: string | null;

    @Field(type => String, nullable)
    	reason_id: string | null;

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

export { Punishment };
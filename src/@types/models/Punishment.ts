import { Punishment as _Punishment, PunishmentType, Reason as _Reason } from '@prisma/client';
import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

import { AbstractGuild } from './guild';
import { User } from './user';

const nullable = { nullable: true };

@ObjectType()
class Punishment implements Omit<_Punishment, 'author_id' | 'user_id' | 'guild_id' | 'id' | 'reason_id' | 'reason'> {
    @Field(type => Date)
    	created_at: Date;

    @Field(type => Boolean)
    @UseMiddleware(DefaultValue(false))
    	deleted: boolean | null;

    @Field(type => Number, nullable)
    	duration: number | null;

    @Field(type => ID)
    	id: string;
    
    @Field(type => String, nullable)
    	reason: String | null;

    @Field(type => String)
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
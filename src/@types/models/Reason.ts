import { PunishmentType, Reason as _Reason } from '@prisma/client';
import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

const nullable = { nullable: true };

@ObjectType()
class Reason implements _Reason {
    @Field(nullable)
    	guild_id: string;

    @Field(type => ID)
    	id: number;
        
    @Field(type => Number, nullable)
    	days: number | null;
        
    @Field(type => Number, nullable)
    	duration: number | null;


    @Field()
    	text: string;

    @Field(type => [String])
    @UseMiddleware(DefaultValue([]))
    	keys: string[];

    @Field(type => [String], nullable)
    	types: PunishmentType[];
}

export { Reason };
import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

import { GuildFeature } from 'discord-api-types/v10';

import Channel from './Channel';
import Role from './Role';

const nullable = { nullable: true };

@ObjectType()
class Guild {
    @Field(type => ID)
    	id: string;

    @Field()
    	name: string;

    @Field(type => [String], { defaultValue: [] })
    @UseMiddleware(DefaultValue([] as GuildFeature[]))
    	features?: GuildFeature[] | undefined;

    @Field(type => String, nullable)
    	icon: string | null;
    
    @Field()
    	owner_id: string;

    @Field(type => String, nullable)
    	banner: string  | null;

    @Field(type => [Channel])
    @UseMiddleware(DefaultValue([] as Channel[]))
    	channels?: Channel[];

    @Field(type => [Role])
    @UseMiddleware(DefaultValue([] as Role[]))
    	roles?: Role[];
}

export { Guild };
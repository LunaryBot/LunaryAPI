import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

import { GuildFeature, APIPartialGuild } from 'discord-api-types/v10';

interface PartialGuild extends APIPartialGuild {
    permissions: number
    owner: boolean
}

const nullable = { nullable: true };

@ObjectType()
class Guild implements PartialGuild {
    @Field(type => String, nullable)
    	description?: string | null | undefined;

    @Field(type => [String], { defaultValue: [] })
    @UseMiddleware(DefaultValue([] as GuildFeature[]))
    	features?: GuildFeature[] | undefined;

    @Field(type => String, nullable)
    	icon: string | null;

    @Field(type => ID)
    	id: string;
    
    @Field()
    	name: string;

    @Field()
    	owner: boolean;

    @Field({ defaultValue: 0 })
    @UseMiddleware(DefaultValue(0))
    	permissions: number;

    @Field(type => String, nullable)
    	splash: string | null;
}

export { Guild };
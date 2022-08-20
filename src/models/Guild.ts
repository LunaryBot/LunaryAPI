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
    @Field(nullable)
    	banner?: string | null | undefined;

    @Field(nullable)
    	description?: string | null | undefined;

    @Field({ defaultValue: [] })
    @UseMiddleware(DefaultValue([] as GuildFeature[]))
    	features?: GuildFeature[] | undefined;

    @Field(nullable)
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

    @Field(nullable)
    	splash: string | null;
}

export { Guild };
import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

import { GuildFeature, APIPartialGuild } from 'discord-api-types/v10';

interface PartialGuild extends APIPartialGuild {
    permissions: number
    owner: boolean
}

const nullable = { nullable: true };

@ObjectType()
class AbstractGuild implements Omit<PartialGuild, 'splash'> {
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
    	owner: boolean;

    @Field({ defaultValue: 0 })
    @UseMiddleware(DefaultValue(0))
    	permissions: number;
}

export { AbstractGuild };
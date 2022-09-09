import { ObjectType, ID, Field, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

const nullable = { nullable: true };

@ObjectType()
class GuildSettings {
    @Field(type => ID)
    	id: string;

    @Field()
    	modlogs_channel: string;

    @Field(nullable)
    	punishments_channel: string;

    @Field(type => [String])
    @UseMiddleware(DefaultValue([]))
    	features: string[];
}

export { GuildSettings };
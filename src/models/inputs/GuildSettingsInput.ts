import { InputType, ID, Field, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

const nullable = { nullable: true };

@InputType()
class GuildSettingsInput {
    @Field(nullable)
    	modlogs_channel: string;

    @Field(nullable)
    	punishments_channel: string;

    @Field(type => [String], nullable)
    @UseMiddleware(DefaultValue([]))
    	features: string[];
}

export { GuildSettingsInput };
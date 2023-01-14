import { InputType, ID, Field, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

import { GuildPermissionsInput, ReasonInput } from '@inputs';

import { EmbedInput } from '../embed';

const nullable = { nullable: true };

@InputType()
class GuildDatabaseInput {
    @Field(nullable)
    	modlogs_channel: string;

    @Field(nullable)
    	punishments_channel: string;

    @Field(type => [String], nullable)
    @UseMiddleware(DefaultValue<string[]>([]))
    	features: string[];

    @Field(type => [EmbedInput])
    @UseMiddleware(DefaultValue<EmbedInput[]>([]))
    	embeds: EmbedInput[];

    @Field(type => [GuildPermissionsInput])
    @UseMiddleware(DefaultValue<GuildDatabaseInput[]>([]))
    	permissions: GuildPermissionsInput[];

    @Field(type => [ReasonInput])
    @UseMiddleware(DefaultValue<ReasonInput[]>([]))
    	reasons: ReasonInput[];
}

export { GuildDatabaseInput };
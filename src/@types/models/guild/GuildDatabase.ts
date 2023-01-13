import { GuildPremiumType } from '@prisma/client';
import { ObjectType, ID, Field, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

import { Embed } from '../embed';
import { GuildPermissions } from './GuildPermissions';
import { Reason } from './Reason';

const nullable = { nullable: true };

@ObjectType()
class GuildDatabase {
    @Field(nullable)
    	modlogs_channel: string;

    @Field(nullable)
    	punishments_channel: string;

    @UseMiddleware(DefaultValue<string[]>([]))
    @Field(type => [String])
    	features: string[];

    @UseMiddleware(DefaultValue<Embed[]>([]))
    @Field(type => [Embed])
    	embeds: Embed[];

    @UseMiddleware(DefaultValue<GuildPermissions[]>([]))
    @Field(type => [GuildPermissions])
    	permissions: GuildPermissions[];

    @UseMiddleware(DefaultValue<Reason[]>([]))
    @Field(type => [Reason])
    	reasons: Reason[];

    @Field(type => String, nullable)
    	premium_type: GuildPremiumType | null;

    @Field(type => Date, nullable)
    	premium_until: Date | null;
}

export { GuildDatabase };
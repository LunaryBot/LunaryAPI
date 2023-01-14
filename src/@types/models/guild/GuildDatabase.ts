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

    @Field(type => [String])
    @UseMiddleware(DefaultValue<string[]>([]))
    	features: string[];

    @Field(type => [Embed])
    @UseMiddleware(DefaultValue<Embed[]>([]))
    	embeds: Embed[];

    @Field(type => [GuildPermissions])
    @UseMiddleware(DefaultValue<GuildPermissions[]>([]))
    	permissions: GuildPermissions[];

    @Field(type => [Reason])
    @UseMiddleware(DefaultValue<Reason[]>([]))
    	reasons: Reason[];

    @Field(type => String, nullable)
    	premium_type: GuildPremiumType | null;

    @Field(type => Date, nullable)
    	premium_until: Date | null;
}

export { GuildDatabase };
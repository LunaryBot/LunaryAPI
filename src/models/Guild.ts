import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import DefaultValue from '../utils/DefaultValue';

import Role from './Role';
import Member from './Member';
import Channel from './Channel';

import { IGuild } from '../@types';

const nullable = { nullable: true };

@ObjectType()
class Guild implements IGuild {
    @Field(_type => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    icon: string;

    @Field({ defaultValue: false })
    @UseMiddleware(DefaultValue(false))
    access?: boolean;

    @Field(_type => [String])
    features: string[];

    @Field()
    owner: boolean;

    @Field()
    permissions: number;

    @Field()
    permissions_new: string;

    @Field(() => [Channel], { defaultValue: [] })
    @UseMiddleware(DefaultValue([]))
    channels?: Array<Channel>;

    @Field(() => [Role], { defaultValue: [] })
    @UseMiddleware(DefaultValue([]))
    roles?: Array<Role>;
}

@ObjectType()
class GuildSettings {
    @Field(nullable)
    punishment_channel: string;

    @Field(nullable)
    configs: number;

    @Field(_type => [GuildRolePermissions], nullable)
    permissions: Array<GuildRolePermissions>;
}

@ObjectType()
class GuildRolePermissions {
    @Field()
    roleID: string;

    @Field()
    permissions: number;
}

export default Guild;

export { GuildSettings }
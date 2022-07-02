import { Field, ObjectType, InputType } from 'type-graphql';

const nullable = { nullable: true };

@InputType()
class GuildSettingsInput {
    @Field(nullable)
    punishment_channel: string;

    @Field(nullable)
    configs: number;

    @Field(_type => [GuildRolePermissionsInput], nullable)
    permissions: Array<GuildRolePermissionsInput>;
}

@InputType()
class GuildRolePermissionsInput {
    @Field()
    roleID: string;

    @Field()
    permissions: number;
}

export { GuildSettingsInput, GuildRolePermissionsInput }
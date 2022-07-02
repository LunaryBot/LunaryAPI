import { Field, ObjectType, InputType } from 'type-graphql';

const nullable = { nullable: true };

@ObjectType()
class GuildSettings {
    @Field(nullable)
    punishment_channel: string;

    @Field(nullable)
    configs: number;

    @Field(_type => [Permissions], nullable)
    permissions: Array<Permissions>;
}

@InputType()
class GuildSettingsInput {
    @Field(nullable)
    punishment_channel: string;

    @Field(nullable)
    configs: number;

    @Field(_type => [PermissionsInput], nullable)
    permissions: Array<PermissionsInput>;
}

@ObjectType()
class Permissions {
    @Field()
    roleID: string;

    @Field()
    permissions: number;
}

@InputType()
class PermissionsInput {
    @Field()
    roleID: string;

    @Field()
    permissions: number;
}

export default GuildSettings;

export { GuildSettingsInput };
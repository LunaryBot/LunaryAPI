import { Field, InputType } from 'type-graphql';
import { MaxLength } from 'class-validator';

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

@InputType()
class PunishmentModifyInput {
    @Field()
    @MaxLength(512)
    	reason: string;
}

export { GuildSettingsInput, GuildRolePermissionsInput, PunishmentModifyInput };
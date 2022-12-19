import { GuildPermissions as _GuildPermissions, GuildPermissionType } from '@prisma/client';
import { ID, InputType, Field } from 'type-graphql';

type TGuildPermissions = Omit<_GuildPermissions, 'permissions' | 'guild_id'> & { permissions: number };
type TGuildCommandPermissions = Omit<TGuildPermissions, 'type'>;

@InputType()
class GuildPermissionsInput implements TGuildPermissions {
    @Field(type => String)
    	type: GuildPermissionType;

    @Field(type => ID)
    	id: string;

    @Field()
    	permissions: number;
}

@InputType()
class GuildCommandPermissionsInput implements TGuildCommandPermissions {
    @Field(type => ID)
    	id: string;

    @Field()
    	permissions: number;
}

export { GuildPermissionsInput, GuildCommandPermissionsInput };
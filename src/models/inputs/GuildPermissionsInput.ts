import { GuildPermissions as _GuildPermissions, GuildPermissionType } from '@prisma/client';
import { ID, InputType, Field } from 'type-graphql';

type TGuildPermissions = Omit<_GuildPermissions, 'permissions' | 'guild_id'> & { permissions: number }

@InputType()
class GuildPermissionsInput implements TGuildPermissions {
    @Field(type => String)
    	type: GuildPermissionType;

    @Field(type => ID)
    	id: string;

    @Field()
    	permissions: number;
}

export { GuildPermissionsInput };
import { GuildPermissions as _GuildPermissions, GuildPermissionType } from '@prisma/client';
import { ID, ObjectType, Field } from 'type-graphql';

type TGuildPermissions = Omit<_GuildPermissions, 'permissions' | 'guild_id'> & { permissions: number }

@ObjectType()
class GuildPermissions implements TGuildPermissions {
    @Field(type => String)
    	type: GuildPermissionType;

    @Field(type => ID)
    	id: string;

    @Field()
    	permissions: number;
}

export { GuildPermissions };
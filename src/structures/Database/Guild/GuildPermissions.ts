import * as Prisma from '@prisma/client';

import BitField from '@utils/BitField';
import * as Constants from '@utils/contants/Constants';

type GuildPermission = keyof typeof Constants.GuildPermissions;

class AbstractGuildPermissions extends BitField<GuildPermission> {
	public static Flags = Constants.GuildPermissions;
}

class GuildPermissions extends AbstractGuildPermissions {
	public type: Prisma.GuildPermissionType;
	public id: string;
	public guildId: string;

	constructor(data: Prisma.GuildPermissions) {
		super(data.permissions);

		this.type = data.type;
		this.id = data.id;
		this.guildId = data.guild_id;
	}

	public static Flags = Constants.GuildPermissions;
}

export { GuildPermissions, AbstractGuildPermissions };
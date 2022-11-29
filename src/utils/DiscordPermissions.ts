import BitField from '@utils/BitField';

import { PermissionFlagsBits } from 'discord-api-types/v10';

type TDiscordPermission = keyof typeof PermissionFlagsBits;

class DiscordPermissions extends BitField<TDiscordPermission> {
	public static Flags = PermissionFlagsBits;
}

export { DiscordPermissions };
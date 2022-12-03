import { GuildPermissions as _GuildPermissions } from '@prisma/client';

import { AbstractGuildPermissions } from '@Database';

import ApiError from '@utils/ApiError';
import { DiscordPermissions } from '@utils/DiscordPermissions';

type GuildPermissionsInput = Omit<_GuildPermissions, 'guild_id' | 'permissions'> & { permissions: number };

const typeCommands = [
	'BAN_USER', 
	'BAN_REMOVE',
	'KICK_USER',
	'MUTE_USER',
	'MUTE_REMOVE',
	'ADV_USER',
	'ADV_REMOVE_USER',
	'ADV_REMOVE_ID',
	'ADV_LIST',
];

function GuildPermissionsValidation(raw: GuildPermissionsInput[]) {
	const lunaryPermissionsBitfieldTest = new AbstractGuildPermissions();
	const discordPermissionsBitfieldTest = new DiscordPermissions();

	const errors: string[] = [];

	const data = raw.map(({ permissions, type, id }, i) => {
		const bitfield = type == 'ROLE' ? lunaryPermissionsBitfieldTest : discordPermissionsBitfieldTest;

		bitfield.bitfield = BigInt(permissions);

		let isError = false;
		let messageError: string = '';

		try {
			if(type == 'COMMAND' && !typeCommands.includes(id)) {
				throw new Error('Invalid Command ID');
			}

			if(bitfield.resolve(bitfield.toArray()) !== BigInt(permissions)) {
				isError = true;
			}
		} catch (error) {
			isError = true;
			if((error as Error).message.includes('BitField Invalid')) {
				messageError = 'BitField Invalid';
			} else if((error as Error).message.includes('Invalid Command ID')) {
				messageError = 'Invalid Command ID';
			} else {
				throw error;
			}
		} finally {
			if(isError) {
				errors.push(`raw[${i}]: ${messageError}`);
			}

			return { permissions: BigInt(permissions), type, id };
		}
	});

	if(errors.length) throw new ApiError('Invalid Raw', 400, errors);

	return data;
}

export { GuildPermissionsValidation };
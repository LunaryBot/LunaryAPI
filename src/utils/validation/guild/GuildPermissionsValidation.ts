import { GuildPermissions as _GuildPermissions } from '@prisma/client';

import { AbstractGuildPermissions } from '@Database';

import ApiError from '@utils/ApiError';

type TGuildPermissions = Omit<_GuildPermissions, 'guild_id' | 'permissions'> & { permissions: number };

function GuildPermissionsValidation(newData: TGuildPermissions[], guildId: string) {
	const bitfieldTest = new AbstractGuildPermissions();

	const errors: string[] = [];

	const data = newData.map(({ permissions, type, id }, i) => {
		bitfieldTest.bitfield = BigInt(permissions);

		let isError = false;

		try {
			if(AbstractGuildPermissions.resolve(bitfieldTest.toArray()) !== BigInt(permissions)) {
				isError = true;
			}
		} catch (error) {
			if((error as Error).message.includes('BitField Invalid')) {
				isError = true;
			} else {
				throw error;
			}
		} finally {
			if(isError) {
				errors.push(`raw.${i}: BitField Invalid`);
			}

			return { permissions: BigInt(permissions), type, id };
		}
	});

	if(errors.length) throw new ApiError('Invalid Raw', 400, errors);

	return data;
}

export { GuildPermissionsValidation };
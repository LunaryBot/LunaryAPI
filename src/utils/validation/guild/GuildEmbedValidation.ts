import { Embed } from '@prisma/client';

import ApiError from '@utils/ApiError';
import { EmbedSchema } from '@utils/schemas';

const placeholdersLength = [
	[['@user', 'user.mention', '@author', 'author.mention', '@staff', 'staff.mention'], 23],
	[['user.tag', 'author.tag', 'staff.tag'], 37],
	[['user.username', 'user.name', 'author.username', 'user.name'], 32],
	[['user.discriminator', 'author.discriminator'], 4],
	[['user.id', 'author.id', 'staff.id'], 20],
	[['user.avatar', 'user.icon', 'author.avatar', 'author.icon', 'staff.avatar', 'staff.icon'], 34],
	[['punishment', 'punishment.type'], 10],
	[['punishment.id'], 8],
	[['punishment.reason'], 512],
	[['punishment.duration'], 50],
];

function GuildEmbedValidation(embed: Omit<Embed, 'guild_id' | 'type'>): Omit<Embed, 'guild_id' | 'type'> {
	// console.log(EmbedSchema.parse(embed));
	if(!EmbedSchema.test(embed)) throw new ApiError('Invalid embed body');

	return embed;
}

export { GuildEmbedValidation };
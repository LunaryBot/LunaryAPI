import { Embed } from '@prisma/client';

import ApiError from '@utils/ApiError';
import { EmbedSchema } from '@utils/schemas';

function GuildEmbedValidation(embed: Omit<Embed, 'guild_id' | 'type'>): Omit<Embed, 'guild_id' | 'type'> {
	// console.log(EmbedSchema.parse(embed));
	if(!EmbedSchema.test(embed)) throw new ApiError('Invalid embed body');

	return embed;
}

export { GuildEmbedValidation };
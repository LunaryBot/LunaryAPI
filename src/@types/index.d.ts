import { PunishmentType, Embed as _Embed } from '@prisma/client';
import type { ExpressContext } from 'apollo-server-express';

import { APIEmbed } from 'discord-api-types/v10';

export interface Embed extends Omit<_Embed, 'embeds'> {
	embeds?: Array<Omit<APIEmbed, 'type' | 'timestamp'> & { timestamp?: boolean }>;
}

export interface MyContext extends ExpressContext {
	token?: string;
	userId?: string;
	guildId?: string;

	readonly apollo: Apollo;
}

export type InventoryItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'EXOTIC' | 'MYSTIC';

export type InventoryItemType = 'BACKGROUND' | 'LAYOUT';

export interface InventoryItem {
	id: number;
	type: InventoryItemType;

	name: string;
	description: string;

	price: number;
	rarity: InventoryItemRarity;

	assets: {
		image_url: string;
	}
}

export interface PunishmentFilter {
    authorId?: string;
	userId?: string;
	guildId?: string;
	after?: Date;
	before?: Date;
	type?: PunishmentType|PunishmentType[];
	limit?: number;
}
import { PunishmentType } from '@prisma/client';

export interface PunishmentFilter {
    authorId?: string;
	userId?: string;
	guildId?: string;
	after?: Date;
	before?: Date;
	type?: PunishmentType|PunishmentType[];
	limit?: number;
}
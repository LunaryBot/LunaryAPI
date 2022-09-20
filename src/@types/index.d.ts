import { PunishmentType } from '@prisma/client';
import type { ExpressContext } from 'apollo-server-express';

export interface PunishmentFilter {
    authorId?: string;
	userId?: string;
	guildId?: string;
	after?: Date;
	before?: Date;
	type?: PunishmentType|PunishmentType[];
	limit?: number;
}

export interface MyContext extends ExpressContext {
    token?: string;
    userId?: string;
    guildId?: string;

    readonly apollo: Apollo;
}
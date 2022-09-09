import { PunishmentType } from '@prisma/client';
import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';

import { Punishment } from '@models';

import { MyContext } from '../@types/Server.d';

const nullable = { nullable: true };

@Resolver()
class PunishmentResolver {
	@Query(() => [Punishment])
	async Punishments(
		@Ctx() context: MyContext,
		@Arg('user_id', nullable) userId: string,
        @Arg('author_id', nullable) authorId: string,
        @Arg('type', type => String, nullable) type: PunishmentType,
        @Arg('after', nullable) after: Date,
        @Arg('before', nullable) before: Date
	) {
		return await context.apollo.controllers.punishments.fetch({ userId, authorId, type, after, before });
	} 
}

export default PunishmentResolver;
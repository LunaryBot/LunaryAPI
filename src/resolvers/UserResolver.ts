import { Resolver, Query, Ctx, Authorized, Arg } from 'type-graphql';

import { AbstractGuild, Guild, User } from '@models';

import { MyContext } from '../@types';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@Resolver()
class UserResolver {
    @Authorized()
    @Query(() => User)
	async CurrentUser(@Ctx() context: MyContext) {
		return await context.apollo.controllers.users.fetch(context.userId as string);
	}

	@Authorized()
	@Query(() => [AbstractGuild])
    async CurrentUserGuilds(@Ctx() context: MyContext, @Arg('filter', { nullable: true }) filterGuilds: boolean) {
    	return await context.apollo.controllers.users.fetchGuilds(context.token as string, { filterByHasBot: !!filterGuilds, filterPermission: PermissionFlagsBits.Administrator });
    }
}

export default UserResolver;
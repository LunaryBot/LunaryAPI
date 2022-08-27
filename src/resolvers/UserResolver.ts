import { Resolver, Query, Ctx, Authorized } from 'type-graphql';

import { AbstractGuild, Guild, User } from '@models';

import { MyContext } from '../@types/Server';

@Resolver()
class UserResolver {
    @Authorized()
    @Query(() => User)
	async CurrentUser(@Ctx() context: MyContext) {
		return await context.apollo.controllers.users.fetch(context.userId as string);
	}

	@Authorized()
	@Query(() => [AbstractGuild])
    async CurrentUserGuilds(@Ctx() context: MyContext) {
    	return await context.apollo.controllers.users.fetchGuilds(context.token as string);
    }
}

export default UserResolver;
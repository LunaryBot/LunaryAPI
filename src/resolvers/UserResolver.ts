import { Guild, User } from '@models';
import { Resolver, Query, Ctx, Authorized } from 'type-graphql';

import { MyContext } from '../@types/Server';

@Resolver()
class UserResolver {
    @Authorized()
    @Query(() => User)
	async CurrentUser(@Ctx() context: MyContext) {
		return await context.apollo.controllers.users.fetch(context.userId as string);
	}

	@Authorized()
	@Query(() => Guild)
    async CurrentGuilds(@Ctx() context: MyContext) {
		
    }
}

export default UserResolver;
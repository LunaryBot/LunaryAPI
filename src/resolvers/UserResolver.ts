import { User } from '@models';
import { Resolver, Query, Ctx, Authorized } from 'type-graphql';

import { MyContext } from '../@types/Server';

@Resolver()
class UserResolver {
	constructor(private apollo: Apollo) {}

    @Authorized()
    @Query(() => User)
	async CurrentUser(@Ctx() context: MyContext) {
		return await context.apollo.controllers.users.fetch(context.userId as string);
	}
}

export default UserResolver;
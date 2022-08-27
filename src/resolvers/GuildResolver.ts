import { Resolver, Query, Ctx, Authorized, Arg } from 'type-graphql';

import { Guild, User } from '@models';

import { MyContext } from '../@types/Server';

@Resolver()
class UserResolver {
    @Authorized()
    @Query(() => User)
	async Guild(@Ctx() context: MyContext, @Arg('id') id: string) {
		return await context.apollo.controllers.guilds.fetch(id);
	}
}

export default UserResolver;
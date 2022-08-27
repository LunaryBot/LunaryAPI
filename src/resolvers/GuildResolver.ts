import { Resolver, Query, Ctx, Authorized, Arg } from 'type-graphql';

import { Guild } from '@models';

import { MyContext } from '../@types/Server';

@Resolver()
class UserResolver {
    @Authorized()
    @Query(() => Guild)
	async Guild(@Ctx() context: MyContext, @Arg('id') id: string) {
		return await context.apollo.controllers.guilds.fetch(id);
	}
}

export default UserResolver;
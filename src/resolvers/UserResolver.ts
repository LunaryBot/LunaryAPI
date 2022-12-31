import { GraphQLResolveInfo } from 'graphql';
import { Resolver, Query, Ctx, Authorized, Arg, Mutation, Info } from 'type-graphql';

import { Utils } from '@utils/Utils';

import { MyContext } from '../@types';
import { AbstractGuild, User, UserDatabase } from '@models';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@Resolver()
class UserResolver {
    @Authorized()
    @Query(() => User)
	async CurrentUser(@Ctx() context: MyContext) {
		return await context.apollo.controllers.users.fetch(context.userId as string);
	}

	@Authorized()
	@Query(() => UserDatabase)
    async CurrentUserDatabase(
		@Ctx() context: MyContext,
		@Info() info: GraphQLResolveInfo
    ) {
    	const select = Utils.graphqlSchemaToPrismaSelect(info, 'CurrentUserDatabase');
    	console.log(select);

    	const data = await context.apollo.controllers.users.fetchDatabase(context.userId as string, select);

    	console.log(data);

    	return data;
    }

	@Authorized()
	@Query(() => [AbstractGuild])
	async CurrentUserGuilds(@Ctx() context: MyContext, @Arg('filter', { nullable: true }) filterGuilds: boolean) {
    	return await context.apollo.controllers.users.fetchGuilds(context.token as string, { filterByHasBot: !!filterGuilds, filterPermission: PermissionFlagsBits.Administrator });
	}
}

export default UserResolver;
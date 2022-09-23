import { Resolver, Query, Ctx, Authorized, Arg, Mutation } from 'type-graphql';

import { Guild, GuildSettings, GuildSettingsInput } from '@models';

import { MyContext } from '../@types';

@Resolver()
class GuildResolver {
    @Authorized()
    @Query(type => Guild)
	async Guild(@Ctx() context: MyContext, @Arg('id') id: string) {
		return await context.apollo.controllers.guilds.fetch(id);
	}

	// @Authorized()
	@Mutation(type => GuildSettings)
    async ModifyGuildModerationSettings(@Ctx() context: MyContext, @Arg('id') id: string, @Arg('data') data: GuildSettingsInput) {
    	return await context.apollo.controllers.guilds.update(id, { op: 'moderation', data });
    }
}

export default GuildResolver;
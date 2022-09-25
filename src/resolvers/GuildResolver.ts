import { EmbedType } from '@prisma/client';
import { Resolver, Query, Ctx, Authorized, Arg, Mutation } from 'type-graphql';

import { Embed, Guild, GuildPermissions, GuildPermissionsInput, GuildSettings, GuildSettingsInput } from '@models';

import { MyContext } from '../@types';

@Resolver()
class GuildResolver {
    @Authorized()
    @Query(type => Guild)
	async Guild(@Ctx() context: MyContext, @Arg('id') id: string) {
		return await context.apollo.controllers.guilds.fetch(id);
	}

	@Query(type => Embed)
    async GuildEmbeds(@Ctx() context: MyContext, @Arg('id') id: string) {
    	return {
    		type: EmbedType.BAN,
    		guild_id: id,
    		content: 'a',
    	};
    }

	// @Authorized()
	@Mutation(type => GuildSettings)
	async ModifyGuildModerationSettings(@Ctx() context: MyContext, @Arg('id') id: string, @Arg('raw') raw: GuildSettingsInput) {
    	return await context.apollo.controllers.guilds.update(id, { op: 'moderation', raw });
	}

	@Mutation(type => [GuildPermissions])
	async ModifyGuildPermissions(@Ctx() context: MyContext, @Arg('id') id: string, @Arg('raw', type => [GuildPermissionsInput]) raw: GuildPermissionsInput[]) {
    	return await context.apollo.controllers.guilds.update(id, { op: 'permissions', raw });
	}
}

export default GuildResolver;
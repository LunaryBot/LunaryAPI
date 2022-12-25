import { EmbedType } from '@prisma/client';
import { Resolver, Query, Ctx, Authorized, Arg, Mutation } from 'type-graphql';

import ApiError from '@utils/ApiError';

import { MyContext } from '../@types';
import { EmbedInput, GuildCommandPermissionsInput, GuildPermissionsInput, GuildSettingsInput, ReasonInput } from '@inputs';
import { Embed, Guild, GuildPermissions, GuildDatabase, Reason } from '@models';

@Resolver()
class GuildResolver {
    // @Authorized()
    @Query(type => Guild)
	async Guild(
		@Ctx() context: MyContext, 
		@Arg('id') id: string
	) {
		return await context.apollo.controllers.guilds.fetch(id);
	}

	@Query(type => [Embed], { defaultValue: [] })
    async GuildEmbeds(
		@Ctx() context: MyContext, 
		@Arg('id') id: string, 
		@Arg('type', { nullable: true }) type?: EmbedType
    ) {
    	if(type && !EmbedType[type]) {
    		throw new ApiError('Invalid type', 400);
    	}
		
    	return await context.apollo.controllers.guilds.fetchEmbed(id, type);
    }

	@Query(type => [Reason])
	async GuildReasons(
		@Ctx() context: MyContext, 
		@Arg('id') id: string
	) {
		return await context.apollo.controllers.guilds.fetchReasons(id);
	}

	// @Authorized()
	@Mutation(type => Boolean)
	async DeleteGuildEmbed(
		@Ctx() context: MyContext, 
		@Arg('id') id: string, 
		@Arg('type') type: EmbedType
	) {
		return await context.apollo.controllers.guilds.update(id, { op: 'embeds', raw: { type } });
	}

	@Mutation(type => Embed)
	async ModifyGuildEmbed(
		@Ctx() context: MyContext, 
		@Arg('id') id: string, 
		@Arg('type') type: EmbedType, 
		@Arg('data', type => EmbedInput) raw: EmbedInput
	) {
		return await context.apollo.controllers.guilds.update(id, { op: 'embeds', raw: { ...raw, type } });
	}

	@Mutation(type => [Reason])
	async ModifyGuildReasons(
		@Ctx() context: MyContext, 
		@Arg('id') id: string,
		@Arg('data', type => [ReasonInput]) raw: ReasonInput[]
	) {
		return await context.apollo.controllers.guilds.update(id, { op: 'reasons', raw });
	}

	@Mutation(type => GuildDatabase)
	async ModifyGuildModerationSettings(
		@Ctx() context: MyContext, 
		@Arg('id') id: string, 
		@Arg('data') raw: GuildSettingsInput
	) {
    	return await context.apollo.controllers.guilds.update(id, { op: 'moderation', raw });
	}

	@Mutation(type => [GuildPermissions])
	async ModifyGuildPermissions(
		@Ctx() context: MyContext, 
		@Arg('id') id: string, 
		@Arg('data', type => [GuildPermissionsInput]) raw: GuildPermissionsInput[]
	) {
    	return await context.apollo.controllers.guilds.update(id, { op: 'permissions', raw });
	}

	@Mutation(type => [GuildPermissions])
	async ModifyGuildCommandPermissions(
		@Ctx() context: MyContext,
		@Arg('id') id: string, 
		@Arg('data', type => [GuildCommandPermissionsInput]) raw: GuildCommandPermissionsInput[]
	) {
    	return await context.apollo.controllers.guilds.update(id, { 
			op: 'permissions', 
			raw: raw.map(permission => ({
				...permission,
				type: 'COMMAND',
			} as GuildPermissionsInput)),
		}, { replacePermissions: false });
	}
}

export default GuildResolver;
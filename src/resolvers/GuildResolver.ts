import { EmbedType } from '@prisma/client';
import { FieldNode, GraphQLResolveInfo, SelectionNode } from 'graphql';
import { Resolver, Query, Ctx, Authorized, Arg, Mutation, Info } from 'type-graphql';

import ApiError from '@utils/ApiError';
import { Utils } from '@utils/Utils';

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

	@Query(type => GuildDatabase)
    async GuildDatabase(
		@Ctx() context: MyContext,
		@Info() info: GraphQLResolveInfo,
		@Arg('id') id: string
    ) {
    	const select = Utils.graphqlSchemaToPrismaSelect(info, 'GuildDatabase');

    	const data = await context.apollo.controllers.guilds.fetchDatabase(id, select);

    	console.log(data);

    	return data;
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
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

    	return await context.apollo.controllers.guilds.fetchDatabase(id, select);
    }

	// @Authorized()
	@Mutation(type => Boolean)
	async DeleteGuildEmbed(
		@Ctx() context: MyContext, 
		@Info() info: GraphQLResolveInfo,
		@Arg('id') id: string, 
		@Arg('type') type: EmbedType
	) {
		const select = Utils.graphqlSchemaToPrismaSelect(info, 'DeleteGuildEmbed');

		return await context.apollo.controllers.guilds.update(id, { op: 'embeds', raw: { type } }, select);
	}

	@Mutation(type => GuildDatabase)
	async ModifyGuildEmbed(
		@Ctx() context: MyContext, 
		@Info() info: GraphQLResolveInfo,
		@Arg('id') id: string, 
		@Arg('type') type: EmbedType, 
		@Arg('data', type => EmbedInput) raw: EmbedInput
	) {
		const select = Utils.graphqlSchemaToPrismaSelect(info, 'ModifyGuildEmbed');

		return await context.apollo.controllers.guilds.update(id, { op: 'embeds', raw: { ...raw, type } }, select);
	}

	@Mutation(type => [Reason])
	async ModifyGuildReasons(
		@Ctx() context: MyContext, 
		@Info() info: GraphQLResolveInfo,
		@Arg('id') id: string,
		@Arg('data', type => [ReasonInput]) raw: ReasonInput[]
	) {
		const select = Utils.graphqlSchemaToPrismaSelect(info, 'ModifyGuildReasons');

		return await context.apollo.controllers.guilds.update(id, { op: 'reasons', raw }, select);
	}

	@Mutation(type => GuildDatabase)
	async ModifyGuildModerationSettings(
		@Ctx() context: MyContext,
		@Info() info: GraphQLResolveInfo,
		@Arg('id') id: string, 
		@Arg('data') raw: GuildSettingsInput
	) {
		const select = Utils.graphqlSchemaToPrismaSelect(info, 'ModifyGuildModerationSettings');

    	return await context.apollo.controllers.guilds.update(id, { op: 'moderation', raw }, select);
	}

	@Mutation(type => GuildDatabase)
	async ModifyGuildPermissions(
		@Ctx() context: MyContext, 
		@Info() info: GraphQLResolveInfo,
		@Arg('id') id: string,
		@Arg('data', type => [GuildPermissionsInput]) raw: GuildPermissionsInput[]
	) {
		const select = Utils.graphqlSchemaToPrismaSelect(info, 'ModifyGuildPermissions');

    	return await context.apollo.controllers.guilds.update(id, { op: 'permissions', raw }, select);
	}

	@Mutation(type => [GuildPermissions])
	async ModifyGuildCommandPermissions(
		@Ctx() context: MyContext,
		@Info() info: GraphQLResolveInfo,
		@Arg('id') id: string, 
		@Arg('data', type => [GuildCommandPermissionsInput]) raw: GuildCommandPermissionsInput[]
	) {
		const select = Utils.graphqlSchemaToPrismaSelect(info, 'ModifyGuildCommandPermissions');

    	return await context.apollo.controllers.guilds.update(id, { 
			op: 'permissions', 
			raw: raw.map(permission => ({
				...permission,
				type: 'COMMAND',
			} as GuildPermissionsInput)),
		}, select, { replacePermissions: false });
	}
}

export default GuildResolver;
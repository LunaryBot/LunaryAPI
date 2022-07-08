import { Resolver, Query, Ctx, Authorized } from 'type-graphql';
import axios from 'axios';

import User from '../models/User';
import Guild from '../models/Guild';

import Utils from '../utils/Utils';
import ApiError from '../utils/ApiError';

import { MyContext } from '../@types/Server';

const botApi = axios.create({
	baseURL: process.env.BOT_API_URL,
	headers: {
		Authorization: `${process.env.BOT_API_TOKEN}`,
	},
});

@Resolver()
class UsersResolver {

    @Authorized()
    @Query(() => User)
	async CurrentUser( @Ctx() context: MyContext ) {
		const token = context.token as string;

		const d = await Utils.login(token);

		const { status, ...data } = d;

		if(status == 200) {
			apollo.idsCache.set(token, data.id);
		} else {
			throw new ApiError(data?.message as string, status);
		}

		return data;
	}

    @Authorized()
    @Query(() => [Guild])
    async CurrentUserGuilds( @Ctx() context: MyContext ) {
    	const token = context.token as string;

    	const d = await Utils.getUserGuilds(token);

    	const { status, ...data } = d;

    	if(status != 200) {
    		throw new ApiError(data?.message as string, status);
    	}

    	if(Array.isArray(data?.guilds)) {
    		const filteredGuilds = await filterGuilds((data.guilds as Array<Guild>).filter(guild => guild.owner === true || (guild.permissions & 8) === 8).map(guild => guild.id));

    		data.guilds = data.guilds.map(guild => {
    			if(filteredGuilds.includes(guild.id)) {
    				guild.access = true;
    			}

    			return guild as Guild;
    		}) as Array<Guild>;
    	}

    	return data.guilds || [];
    }
}

async function filterGuilds(guilds: Array<string>): Promise<Array<string>> {
	const botGuilds = await botApi.post('/guilds', {
		guilds,
	}).catch(e => e.response);

	return botGuilds.data || [];
}

export default UsersResolver;
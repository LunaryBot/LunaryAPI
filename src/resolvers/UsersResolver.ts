import { Resolver, Query, Arg } from 'type-graphql';
import axios from 'axios';

import User from '../models/User';
import Guild from '../models/Guild'

import Utils from '../utils/Utils';

const botApi = axios.create({
    baseURL: process.env.BOT_API_URL,
    headers: {
        Authorization: `${process.env.BOT_API_TOKEN}`,
    },
});

@Resolver()
class UsersResolver {
    @Query(() => User)
    async CurrentUser( @Arg('token') token: string ) {
        const d = await Utils.login(token);

        const { status, ...data } = d;

        if(status == 200) {
            apollo.idsCache.set(token, data.id);
        }

        return data;
    }

    @Query(() => [Guild])
    async CurrentUserGuilds( @Arg('token') token: string ) {
        const d = await Utils.getUserGuilds(token);

        const { status, ...data } = d;

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
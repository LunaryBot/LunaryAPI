import { Resolver, Query, Arg } from 'type-graphql';
import axios, { AxiosResponse } from 'axios';

import User from '../models/User';
import Guild from '../models/Guild'

import Utils from '../utils/Utils';
import { GuildResponse } from '../models/Responses';

const botApi = axios.create({
    baseURL: process.env.BOT_API_URL,
    headers: {
        Authorization: `${process.env.BOT_API_TOKEN}`,
    },
});

@Resolver()
class GuildsResolver {
    private usersIdCache = new Map<string, string>();

    private async userID(token: string) {
        if(!token) {
            throw new Error('No token provided');
        }

        if(this.usersIdCache.has(token)) {
            return this.usersIdCache.get(token);
        }

        console.log('Fetching user...');
        
        const d = await Utils.login(token);

        const { status, ...data } = d;

        if(status !== 200) {
            throw new Error(data.message);
        }

        this.usersIdCache.set(token, data.id);

        return data.id;
    }

    @Query(() => GuildResponse)
    async Guild( @Arg('id') id: string, @Arg('token') token: string ) {
        const userID = await this.userID(token);

        const response = await botApi.get(`/guilds/${id}`, {
            headers: {
                RequesterId: userID,
            }
        }).catch(e => e.response as AxiosResponse);

        const { status = 500, data, statusText = 'Internal Server Error' } = (response || {}) as AxiosResponse;

        if(status != 200) {
            throw new Error(`Error ${status} (${statusText})`);
        }

        if(data?.guild && status == 200) {
            data.user = { ...data.member.user };
            delete data?.member?.user;
        }

        const { user, guild, member } = data;

        return { user, guild, member };
    }
}

export default GuildsResolver;
import { Constants } from 'eris';
import { Resolver, Query, Arg, Authorized, Ctx,  } from 'type-graphql';
import { gql } from 'graphql-request';
import axios, { AxiosResponse } from 'axios';

import User from '../models/User';
import Guild from '../models/Guild'

import { MyContext } from '../@types/Server';

import Utils from '../utils/Utils';
import { GuildResponse } from '../models/Responses';
import client from '../utils/BotAPIClient';
import { IMember } from '../@types';

const { Permissions } = Constants;

const botApi = axios.create({
    baseURL: process.env.BOT_API_URL,
    headers: {
        Authorization: `${process.env.BOT_API_TOKEN}`,
    },
});

const memberQuery = gql`
    query GuildMember($user: String!, $guild: String!) {
        GuildMember(user: $user, guild: $guild) {
            permissions
            roles
        }
    }
`

@Resolver()
class GuildsResolver {
    
    @Authorized(Permissions.administrator)
    @Query(() => GuildResponse)
    async Guild( @Arg('id') id: string, @Arg('token') token: string, @Ctx() context: MyContext ) {
        const response = await botApi.get(`/guilds/${id}`, {
            headers: {
                RequesterId: context.userId as string,
            }
        }).catch(e => e.response as AxiosResponse);

        const { status = 500, data, statusText = 'Internal Server Error' } = (response || {}) as AxiosResponse;

        if(status != 200) {
            throw new Error(`Error ${status} (${data?.message || statusText})`);
        }

        if(data?.guild && status == 200) {
            data.user = { ...data.member.user };
            data.guild.access = true;
            delete data?.member?.user;
        }

        const { user, guild, member } = data;

        return { user, guild, member };
    }

    static async getMember(guildID: string, userID: string): Promise<IMember> {
        const response = await client.request(memberQuery, {
            guild: guildID,
            user: userID,
        });

        return response?.GuildMember;
    }
}

export default GuildsResolver;
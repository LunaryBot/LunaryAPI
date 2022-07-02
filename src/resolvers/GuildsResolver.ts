import { Constants } from 'eris';
import { Resolver, Query, Arg, Authorized, Ctx, Mutation, Args,  } from 'type-graphql';
import { gql } from 'graphql-request';
import axios, { AxiosResponse } from 'axios';

import User from '../models/User';
import { GuildSettings } from '../models/Guild'
import { GuildResponse } from '../models/Responses';
import { GuildSettingsInput } from '../models/Inputs';

import { MyContext } from '../@types/Server';
import { IMember } from '../@types';

import Utils from '../utils/Utils';
import client from '../utils/BotAPIClient';
import { Schema } from '../utils/GuildSettings';
import ApiError from '../utils/ApiError';

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

    @Authorized(Permissions.administrator)
    @Mutation(() => GuildSettings)
    async ModifyGuild( @Arg('id') id: string, @Arg('data') data: GuildSettingsInput, @Ctx() context: MyContext ) {
        const dbData = await dbs.getGuild(context.guildId as string);

        let newdbData: any = {};

        Object.entries(data || {}).forEach(([key, value]: [string, any]) => {
            const fn = Schema[key as keyof typeof Schema];

            if(fn) {
                // @ts-ignore
                const _value = fn(value, dbData);

                if(_value) newdbData[key] = _value;
            }
        });

        if(!Object.keys(newdbData).length) {
            throw new ApiError('No valid settings data.', 403)
        }

        newdbData = Object.assign(dbData, newdbData);

        await dbs.setGuild(context.guildId as string, newdbData);

        return newdbData;
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
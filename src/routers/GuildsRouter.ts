import { Router } from 'express';
import axios, { AxiosInstance } from 'axios';
import { Client } from 'eris';

import BaseRouter from '../structures/BaseRouter';
import Databases from '../structures/Databases';
import Gateway from '../structures/Gateway';

import Utils from '../utils/Utils';
import * as GuildSettings from '../utils/GuildSettings';
import { IGuild } from '../@types';
import Apollo from '../structures/Apollo';

class GuildsRouter extends BaseRouter {
    public botApi: AxiosInstance;
    public usersIdCache: Map<string, string>;

    constructor(data: { dbs: Databases; server: Apollo, wss: Gateway, client: Client }) {
        super({
            server: data.server,
            router: Router(),
            dbs: data.dbs,
            path: '/guilds',
            client: data.client
        });

        this.botApi = axios.create({
            baseURL: process.env.BOT_API_URL,
            headers: {
                Authorization: `${process.env.BOT_API_TOKEN}`,
            },
        });

        this.usersIdCache = new Map();

        this.use(async (req, res, next) => {
            const token = req.headers.authorization as string;
            
            if(!token) {
                return res.status(401).send({
                    message: 'No token provided'
                });
            }

            if(this.usersIdCache.has(token)) {
                req.userId = this.usersIdCache.get(token) as string;
                return next();
            }

            console.log('Fetching user...');
            
            const d = await Utils.login(token);

            const { status, ...data } = d;

            if(status !== 200) {
                return res.status(status).send(data);
            }

            this.usersIdCache.set(token, data.id);

            req.userId = data.id;

            next();
        });

        this.get('/@me', async (req, res) => {
            const d = await Utils.getUserGuilds(req.headers.authorization as string);

            const { status, ...data } = d;

            if(Array.isArray(data?.guilds)) {
                const filteredGuilds = await (data.guilds as IGuild[]).filter(guild => guild.owner === true || (guild.permissions & 8) === 8).map(guild => guild.id);

                data.guilds = data.guilds.map(guild => {
                    if(filteredGuilds.includes(guild.id)) {
                        guild.access = true;
                    }

                    return guild as IGuild;
                }) as IGuild[];
            }

            res.status(status).json( Array.isArray(data?.guilds) ? data.guilds : data );
        });

        this.get('/:guildID', async(req, res) => {
            const guildID = req.params.guildID;

            if(!guildID) return res.status(401).json({ message: 'No id provided' });

            const response = await this.botApi.get(`/guilds/${guildID}`, {
                headers: {
                    RequesterId: req.userId,
                }
            }).catch(e => e.response);

            const { status = 500, data } = response || {};

            if(data?.guild && status == 200) {
                data.user = { ...data.member.user };
                delete data?.member?.user;

                data.guild.settings = await this.dbs.getGuild(guildID);
            }

            res.status(status).json(data);
        });

        this.patch('/:guildID', async(req, res) => {
            const { type, data } = (req.body || {}) as { type: string, data: string };
            if(!type || !(type in GuildSettings.Schema)) return {
                message: 'Invalid update type.'
            }

            if(!data || typeof data !== 'object') return {
                message: 'Invalid settings data.'
            }

            const dbData = await this.dbs.getGuild(req.params.guildID);

            let newdbData: any = {};

            if(!Object.keys(newdbData).length) {
                return res.status(304).json({
                    message: 'No valid settings data.',
                });
            }

            newdbData = Object.assign(dbData, newdbData);

            await this.dbs.setGuild(req.params.guildID, newdbData);
            
            res.status(200).json({
                message: 'Successfully updated guild settings.',
                data: newdbData
            });
        });
    }
}

export default GuildsRouter;
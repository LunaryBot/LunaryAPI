import { Router, Express } from 'express';
import { WebSocketServer } from 'ws';
import axios from 'axios';
import { Client } from 'eris';

import BaseRouter from '../structures/BaseRouter';
import Databases from '../structures/Databases';

import Utils from '../utils/Utils';
import * as GuildSettings from '../utils/GuildSettings';

class GuildsRouter extends BaseRouter {
    constructor(data: { dbs: Databases; app: Express, wss: WebSocketServer, client: Client }) {
        super({
            wss: data.wss,
            app: data.app,
            router: Router(),
            dbs: data.dbs,
            path: '/guilds',
            client: data.client
        });

        const botApi = axios.create({
            baseURL: process.env.BOT_API_URL,
            headers: {
                Authorization: `${process.env.BOT_API_TOKEN}`,
            },
        });

        this.router.use(async (req, res, next) => {
            if(!req.headers.authorization) {
                return res.status(401).send({
                    message: 'No token provided'
                });
            }

            const token = req.headers.authorization;

            const d = await Utils.login({ token, dbs: this.dbs });

            const { status, ...data } = d;

            if(status !== 200) {
                return res.status(status).send(data);
            }

            req.user = data;

            next();
        })

        this.router.get('/:guildID', async(req, res) => {
            const guildID = req.params.guildID;

            if(!guildID) return res.status(401).json({ message: 'No id provided' });

            const response = await botApi.get(`/guilds/${guildID}`, {
                headers: {
                    RequesterId: req.user?.id,
                }
            }).catch(e => e.response);

            const { status = 500, data } = response || {};

            if(data?.guild && status == 200) {
                delete data?.member?.user;
                data.user = req.user;

                data.guild.settings = await this.dbs.getGuild(guildID);
            }

            res.status(status).json(data);
        });

        this.router.patch('/:guildID', async(req, res) => {
            const { type, data } = (req.body || {}) as { type: string, data: string };
            if(!type || !(type in GuildSettings.Schema)) return {
                message: 'Invalid update type.'
            }

            if(!data || typeof data !== 'object') return {
                message: 'Invalid settings data.'
            }

            const dbData = await this.dbs.getGuild(req.params.guildID);

            let newdbData: any = {};

            const SubSchema: any = GuildSettings.Schema[type as 'moderation' | 'permissions'];

            if(typeof SubSchema == 'object') {
                Object.entries(data || {}).forEach(([key, value]: [string, any]) => {
                    const fn = SubSchema[key];

                    if(fn) {
                        const _value = fn(value);

                        if(_value) newdbData[key] = _value;
                    }
                });
            } else if(typeof SubSchema == 'function') {
                const _value = SubSchema(data, dbData);

                if(_value) newdbData = _value;
            }

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
        })
    }
}

export default GuildsRouter;
import { Router, Express } from 'express';
import { WebSocketServer } from 'ws';
import { Client } from 'eris';
import axios, { AxiosInstance } from 'axios';

import BaseRouter from '../structures/BaseRouter';
import Databases from '../structures/Databases';

import Utils from '../utils/Utils';
import { Guild } from '../@types';
import Gateway from '../structures/Gateway';
import Server from '../structures/Server';

class UsersRouter extends BaseRouter {
    public botApi: AxiosInstance;
    constructor(data: { dbs: Databases; server: Server, wss: Gateway, client: Client }) {
        super({
            server: data.server,
            router: Router(),
            dbs: data.dbs,
            path: '/users',
            client: data.client
        });

        this.botApi = axios.create({
            baseURL: process.env.BOT_API_URL,
            headers: {
                Authorization: `${process.env.BOT_API_TOKEN}`,
            },
        });

        
        this.use(async (req, res, next) => {
            if(!req.headers.authorization) {
                return res.status(401).send({
                    message: 'No token provided'
                });
            }

            const token = req.headers.authorization;

            const d = await Utils.login(token);

            const { status, ...data } = d;

            if(status !== 200) {
                return res.status(status).send(data);
            }

            req.user = data;

            next();
        });

        this.get('/@me', async(req, res) => {
            const settings = await this.dbs.getUser(req.user.id) || {};

            res.status(200).json({
                ...req.user,
                settings,
            });
        });

        this.get('/@me/guilds', async (req, res) => {
            const d = await Utils.getUserGuilds(req.headers.authorization as string);

            const { status, ...data } = d;

            if(Array.isArray(data?.guilds)) {
                const filteredGuilds = await this.filterGuilds((data.guilds as Guild[]).filter(guild => guild.owner === true || (guild.permissions & 8) === 8).map(guild => guild.id));

                // @ts-ignore
                data.guilds = data.guilds.map(guild => {
                    if(filteredGuilds.includes(guild.id)) {
                        guild.access = true;
                    }

                    return guild as Guild;
                }) as Guild[];
            }

            res.status(status).json( Array.isArray(data?.guilds) ? data.guilds : data );
        });

        this.ws('/test', (ws, req) => {
            ws.on('message', (msg) => {
                console.log(msg);
            });
        });
    }

    private async filterGuilds(guilds: string[]) {
        const botGuilds = await this.botApi.post('/guilds', {
            guilds,
        }).catch(e => e.response);

        return botGuilds.data || [];
    }
}

export default UsersRouter;
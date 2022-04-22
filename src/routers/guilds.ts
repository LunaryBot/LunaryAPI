import { Router, Express, Request } from 'express';
import { WebSocketServer } from 'ws';
import axios from 'axios';

import BaseRouter from '../structures/BaseRouter';
import Databases from '../structures/Databases';

import Utils from '../utils/Utils';
import { URLS, User } from '../types';

class GuildsRouter extends BaseRouter {
    constructor(data: { dbs: Databases; app: Express, wss: WebSocketServer }) {
        super({
            wss: data.wss,
            app: data.app,
            router: Router(),
            dbs: data.dbs,
            path: '/guilds'
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

            // @ts-ignore
            req.user = data;

            next();
        })

        this.router.get('/:guildID', async(req, res) => {
            const guildID = req.params.guildID;

            if(!guildID) return res.status(401).json({ message: 'No id provided' });

            const response = await botApi.get(`/guilds/${guildID}`, {
                headers: {
                    //@ts-ignore
                    RequesterId: (req.user as User).id,
                }
            }).catch(e => e.response);

            const { status, data } = response || {};

            res.status(status).json(data);
        });
    }
}

export default GuildsRouter;
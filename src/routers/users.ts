import { Router, Express } from 'express';
import { WebSocketServer } from 'ws';
import { Client } from 'eris';

import BaseRouter from '../structures/BaseRouter';
import Databases from '../structures/Databases';

import Utils from '../utils/Utils';

class UsersRouter extends BaseRouter {
    constructor(data: { dbs: Databases; app: Express, wss: WebSocketServer, client: Client }) {
        super({
            wss: data.wss,
            app: data.app,
            router: Router(),
            dbs: data.dbs,
            path: '/users',
            client: data.client
        });
        
        this.router.use(async (req, res, next) => {
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
        })

        this.router.get('/@me', async(req, res) => {
            const settings = await this.dbs.getUser(req.user.id) || {};

            res.status(200).json({
                ...req.user,
                settings,
            });
        });
    }
}

export default UsersRouter;
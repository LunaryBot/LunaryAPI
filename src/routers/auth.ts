import { Router, Express, query } from 'express';
import { WebSocketServer } from 'ws';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import BaseRouter from '../structures/BaseRouter';
import Databases from '../structures/Databases';

import Utils from '../utils/Utils';
import { URLS } from '../utils/Constants';
import { Client } from 'eris';
import Gateway from '../structures/Gateway';

class AuthRouter extends BaseRouter {
    constructor(data: { dbs: Databases; app: Express, wss: Gateway, client: Client }) {
        super({
            wss: data.wss,
            app: data.app,
            router: Router(),
            dbs: data.dbs,
            path: '/auth',
            client: data.client
        });

        this.router.get('/callback', async(req, res) => {
            const { code, error } = req.query;

            if(!code) {
                if(error) {
                    if(error === 'access_denied') return res.redirect(process.env.WEBSITE_URL);
                }

                return res.status(401).json({ message: 'No code provided' });
            }

            const body = new URLSearchParams();
            
            body.append('client_id', process.env.DISCORD_CLIENT_ID);
            body.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
            body.append('grant_type', 'authorization_code');
            body.append('redirect_uri', `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`);
            body.append('scope', 'identify guilds');
            body.append('code', code as string);

            const data = (await axios.post(URLS.TOKEN, body.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).catch(e => {}))?.data || {};

            if(!data.access_token) return res.status(498).json({ message: 'No access token provided' });

            const token = await jwt.sign({ 
                access_token: data.access_token, 
                refresh_token: data.refresh_token,
                expires_in: Date.now() + (data.expires_in * 1000)
            }, process.env.JWT_SECRET);

            res.redirect(`${process.env.WEBSITE_URL}/auth/callback?token=${token}${(req.query.state ? `&state=${req.query.state}` : '')}`);
        });

        this.router.get('/', async(req, res) => {
            const { token } = req.query as { token: string };
            
            if(!token) return res.status(401).json({ message: 'No token provided' });

            const d = await Utils.login(token);

            const { status, ...data } = d;

            res.status(status).json(data);
        });
    }
}

export default AuthRouter;
import { Router, Express } from 'express';
import { WebSocketServer } from 'ws';
import axios from 'axios';

import BaseRouter from '../structures/BaseRouter';
import Databases from '../structures/Databases';

import Utils from '../utils/Utils';
import { URLS } from '../types';

class AuthRouter extends BaseRouter {
    constructor(data: { dbs: Databases; app: Express, wss: WebSocketServer }) {
        super({
            wss: data.wss,
            app: data.app,
            router: Router(),
            dbs: data.dbs,
            path: '/auth'
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
            body.append('redirect_uri', `http://localhost:2005/auth/callback`);
            body.append('scope', 'identify guilds');
            body.append('code', code as string);
            
            console.log(body.toString());

            const data = (await axios.post(URLS.TOKEN, body.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).catch(e => {}))?.data || {};

            if(!data.access_token) return res.status(498).json({ message: 'No access token provided' });

            const token = Utils.generateToken();

            await this.dbs.setToken(token, { 
                access_token: data.access_token, 
                refresh_token: data.refresh_token,
                expires_in: Date.now() + data.expires_in
            });

            res.redirect(`${process.env.WEBSITE_URL}/login?token=${token}`);
        });

        this.router.get('/', async(req, res) => {
            const { token } = req.query;

            if(!token) return res.status(401).json({ message: 'No token provided' });

            const tokenData = await this.dbs.getToken(token as string);
            
            if(!tokenData || !tokenData?.access_token)  return res.status(401).json({ message: 'Invalid token' });

            if(!tokenData?.expires_in || Date.now() >= tokenData.expires_in) {
                this.dbs.deleteToken(token as string);
                
                return res.status(401).json({ message: 'Token expired' });
            }

            const data = (await axios.get(URLS.USER, {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`
                }
            }).catch(e => {}))?.data || {};

            if(!data?.id) return res.status(401).json({ message: 'Invalid token' });

            res.status(200).json(data);
        });
    }
}

export default AuthRouter;
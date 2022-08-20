import axios from 'axios';
import jwt from 'jsonwebtoken';

import BaseRouter from '@BaseRouter';

import { URLS } from '@utils/Constants';

import { Routes } from 'discord-api-types/v10';

class AuthRouter extends BaseRouter {
	constructor(apollo: Apollo) {
		super({ path: '/auth', apollo });

		this.get('/discord/callback', async(req, res) => {
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
			body.append('redirect_uri', process.env.DISCORD_OAUTH2_REDIRECT_URL);
			body.append('scope', 'identify guilds');
			body.append('code', code as string);

			const tokenD = await this.apollo.apis.discord.post(Routes.oauth2TokenExchange(), {
				body: body.toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}) as { access_token: string, refresh_token: string, expires_in: number };
			const data = (await axios.post(Routes.oauth2TokenExchange(), body.toString(), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}).catch(e => {}))?.data || {};

			if(!data.access_token) return res.status(498).json({ message: 'No access token provided' });

			const token = await jwt.sign({ 
				access_token: data.access_token, 
				refresh_token: data.refresh_token,
				expires_in: Date.now() + (data.expires_in * 1000),
			}, process.env.JWT_SECRET);

			console.log(token);

			res.redirect(`${process.env.WEBSITE_URL}/auth/callback?token=${token}${(req.query.state ? `&state=${req.query.state}` : '')}`);
		});
	}
}

export default AuthRouter;
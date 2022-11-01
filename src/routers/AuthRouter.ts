import axios, { AxiosError, AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';

import BaseRouter from '@BaseRouter';

import { URLS } from '@utils/Constants';

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

			const response = await axios.post(URLS.TOKEN, body.toString(), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}).catch((error: AxiosError) => error.response || {}) as AxiosResponse;

			const data = response.data as { access_token: string, refresh_token: string, expires_in: number };

			if(!data) return res.status(500).json({ message: 'Request OAuth2 infos falied' });

			if(!data.access_token) return res.status(498).json({ message: 'No access token provided in OAuth2 request infos' });

			const token = await jwt.sign({ 
				access_token: data.access_token, 
				refresh_token: data.refresh_token,
				expires_in: Date.now() + (data.expires_in * 1000),
			}, process.env.JWT_SECRET);

			console.log(token); // Remover quando for para produção

			res.redirect(`${process.env.WEBSITE_URL}/auth/discord?token=${token}${(req.query.state ? `&state=${req.query.state}` : '')}`);
		});
	}
}

export default AuthRouter;
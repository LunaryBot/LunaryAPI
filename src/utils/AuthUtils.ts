import jwt from 'jsonwebtoken';

import { APIUser, Routes } from 'discord-api-types/v10';

import ApiError from './ApiError';

class AuthUtils {
	static declare apollo: Apollo;

	static async login(token: string) {
		if(!token) throw new ApiError('No token provided', 401);
        
		try {
			const tokenData = AuthUtils.parseToken(token);
        
			if(!tokenData || !tokenData?.access_token) throw new ApiError('Invalid token', 498);

			if(!tokenData?.expires_in || Date.now() >= tokenData.expires_in) {
				throw new ApiError('Expired token', 498);
			}

			const data = await this.apollo.apis.discord.get(Routes.user(), {
				auth: false,
				headers: {
					Authorization: `Bearer ${tokenData.access_token}`,
				},
			}) as APIUser;

			if(!data?.id) throw new ApiError('Invalid/Expired token', 498);

			await this.apollo.redis.set(`users:${data.id}`, data);

			return data as APIUser;
		} catch (e) {
			console.log(e);
			throw new ApiError('Invalid token', 401);
		}
	}

	static parseToken(token: string) {
		return jwt.verify(token as string, process.env.JWT_SECRET) as { access_token: string, refresh_token: string, expires_in: number };
	}
}

export default AuthUtils;
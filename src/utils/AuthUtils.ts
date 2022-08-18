import axios from 'axios';
import jwt from 'jsonwebtoken';
import ApiError from './ApiError';
import { URLS } from './Constants';

class AuthUtils {
	static async login(token: string) {
		if(!token) throw new ApiError('No token provided', 401);
        
		try {
			const tokenData = await jwt.verify(token as string, process.env.JWT_SECRET) as { access_token: string, refresh_token: string, expires_in: number };
        
			if(!tokenData || !tokenData?.access_token) return { status: 498, message: 'Invalid token' };

			if(!tokenData?.expires_in || Date.now() >= tokenData.expires_in) {
				return { status: 498, message: 'Token expired' };
			}

			const data = (await axios.get(URLS.USER, {
				headers: {
					Authorization: `Bearer ${tokenData.access_token}`
				}
			}).catch(e => {}))?.data || {};

			if(!data?.id) return { status: 498, message: 'Invalid token' };

			return data;
		} catch(e) {
			throw new ApiError('Invalid token', 401);
		}
	}
}

export default AuthUtils;
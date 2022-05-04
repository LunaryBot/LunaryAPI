import Databases from '../structures/Databases';
import axios from 'axios';
import { URLS } from './Constants';
import jwt from 'jsonwebtoken';

class Utils {
    static generateToken() {
        return (Date.now().toString(36) + Array(4).fill(0).map(() => Math.random().toString(36)).join('')).split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c).join('').replace(/\./g, '');
    }

    static async login(token: string) {
        if(!token) return { status: 401, message: 'No token provided' }
        
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

            return { status: 200, ...data };
        } catch(e) {
            return { status: 401, message: 'Invalid token' }
        }
    }
}

export default Utils;
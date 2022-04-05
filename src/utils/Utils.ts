import Databases from '../structures/Databases';
import axios from 'axios';
import { URLS } from '../types';

class Utils {
    static generateToken() {
        return (Date.now().toString(36) + Array(4).fill(0).map(() => Math.random().toString(36)).join('')).split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c).join('').replace(/\./g, '');
    }

    static async login({ token, dbs }: { token: string, dbs: Databases }) {
        if(!token) return { status: 401, message: 'No token provided' }

        const tokenData = await dbs.getToken(token as string);
        
        if(!tokenData || !tokenData?.access_token)  return { status: 498, message: 'Invalid token' };

        if(!tokenData?.expires_in || Date.now() >= tokenData.expires_in) {
            dbs.deleteToken(token as string);
            
            return { status: 498, message: 'Token expired' };
        }

        const data = (await axios.get(URLS.USER, {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        }).catch(e => {}))?.data || {};

        if(!data?.id) return { status: 498, message: 'Invalid token' };

        return { status: 200, ...data };
    }
}

export default Utils;
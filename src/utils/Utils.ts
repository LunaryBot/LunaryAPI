import Databases from '../structures/Databases';
import axios from 'axios';
import { URLS } from './Constants';
import jwt from 'jsonwebtoken';
import { IGuild, IPunishmentLog, IPunishmentLogResolved, IUser, IPunishmentLogsFilter } from '../@types';

const punishmentsTypes: any = {
    ban: 1,
    b: 1,
    kick: 2,
    k: 2,
    mute: 3,
    m: 3,
    adv: 4,
    a: 4,
    warn: 4,
    w: 4,
}

interface IPunishmentLogPreResolved extends IPunishmentLog {
    id: string;
}

const defaultLimit = 20;

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

    static async getUserGuilds(token: string) {
        if(!token) return { status: 401, message: 'No token provided' }
        
        try {
            const tokenData = await jwt.verify(token as string, process.env.JWT_SECRET) as { access_token: string, refresh_token: string, expires_in: number };
        
            if(!tokenData || !tokenData?.access_token) return { status: 498, message: 'Invalid token' };

            if(!tokenData?.expires_in || Date.now() >= tokenData.expires_in) {
                return { status: 498, message: 'Token expired' };
            }

            const data = (await axios.get(URLS.GUILDS, {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`
                }
            }).catch(e => {}))?.data || [];

            return { status: 200, guilds: data as IGuild[] };
        } catch(e) {
            return { status: 401, message: 'Invalid token' }
        }
    }

    static async resolvePunishmentLogs(logs: { [id: string ]: IPunishmentLog }, filters?: IPunishmentLogsFilter) {
        const botApi = axios.create({
            baseURL: process.env.BOT_API_URL,
            headers: {
                Authorization: `${process.env.BOT_API_TOKEN}`,
            },
        });

        const users: Array<string> = [];
        const guilds: Array<string> = [];

        let punishmentsLogs = (Object.entries(logs).map(([id, log]) => {
            if(filters && !testPunishmentLog(log, filters)) {
                return;
            }

            const data = {
                ...log,
                id
            };

            return data;
        }).filter(Boolean) as Array<IPunishmentLogPreResolved>).sort((a, b) => b.timestamp - a.timestamp).slice(0, (filters?.limit ? (filters.limit > 75 ? 75 : filters.limit) : defaultLimit));

        if(filters) {
            punishmentsLogs = punishmentsLogs.filter(log => testPunishmentLog(log, filters));
        }

        punishmentsLogs.forEach(log => {
            ([log.user, log.author]).forEach(user => !users.includes(user) && users.push(user));
            !guilds.includes(log.guild) && guilds.push(log.guild);
        });

        const resolvedUsers: Array<IUser> = await botApi.get('/users/cache', {
            data: { users }
        }).then(res => res.data);

        const resolvedGuilds: Array<IGuild> = await botApi.get('/guilds/cache', {
            data: { guilds }
        }).then(res => res.data);
        
        const resolvedPunishmentsLogs: Array<IPunishmentLogResolved> = punishmentsLogs.map(log => ({
            ...log,
            user: resolvedUsers.find(user => user.id === log.user) as IUser,
            author: resolvedUsers.find(user => user.id === log.author) as IUser,
            guild: resolvedGuilds.find(guild => guild.id === log.guild) as IGuild,
        }));

        return resolvedPunishmentsLogs;
    }
}

function testPunishmentLog(log: IPunishmentLog, filters: IPunishmentLogsFilter): boolean {
    if(filters.type) {
        if(typeof filters.type == 'string' && filters.type in punishmentsTypes) {
            filters.type = punishmentsTypes[filters.type];
        };

        if(filters.type && filters.type !== log.type) return false;
    }

    if(filters.userId && log.user !== filters.userId) {
        return false;
    }

    if(filters.authorId && log.author !== filters.authorId) {
        return false;
    }

    if(filters.guildId && log.guild !== filters.guildId) {
        return false;
    }

    if(filters.afterTimestamp && log.timestamp > filters.afterTimestamp) {
        return false;
    }

    if(filters.beforeTimestamp && log.timestamp < filters.beforeTimestamp) {
        return false;
    }

    return true;
}

export default Utils;
import Action from '../structures/Action';
import { IContext, ILog } from '../types';
import chunk from '../utils/chunk';
import getUser from '../utils/getUser';
import decode from '../utils/decode';

interface IGetLogsData {
    chunk?: number;
    limit?: number;
    filters?: string;
    id?: string;
}

interface IFilters { 
    userId: string; 
    authorId: string, 
    type: number | string
}

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

const limitMax = 25;
const limitDefault = 10;

class GetGuildLogs extends Action {
    constructor() {
        super({
            op: 'getGuildLogs',
            isGuild: true
        });
    }
    
    async execute(ctx: IContext, data: IGetLogsData) {
        const allLogs: ILog = await ctx.dbs.getLogs();

        let { limit = limitDefault, chunk: _chunk = 0, filters, id } = data || {};
        _chunk = !(Number(_chunk) < 0) ? Number(_chunk) : 0;
        limit = (!(limit > limitMax) && limit > 0) ? limit : limitDefault;

        let logs: ILog[] = Object.entries(allLogs).map(
            function([k, v]: [string, string], i) {
                const data = JSON.parse(Buffer.from(v, 'base64').toString('ascii'))
                data.id = k
                return data
            })
            .filter(x => x.server == ctx.guildId)
            .sort((a, b) => b.date - a.date) || [];

        if(id) {
            logs = logs.filter(x => x.id == data.id?.toLowerCase?.());
        } else if(filters) {
            const { userId, authorId, type }: IFilters = decode(typeof filters == "string" ? filters : "") as IFilters;
                
            if(userId) logs = logs.filter(x => x.user == userId);
            if(authorId) logs = logs.filter(x => x.author == authorId);
            if(type) logs = logs.filter(x => x.type == (Number(type) || punishmentsTypes[type]));    
        }

        const chunks = chunk(logs, limit);
        logs = chunks[_chunk] || []
            
        const _logs = (await Promise.all(await logs.map(async function(log: ILog) {
            const data  = { 
                ...log,
                reason: decodeURIComponent(log.reason),
                user: (await getUser(log.user as string)),
                author: (await getUser(log.author as string)),
            }

            return data
        })));

        return {
            filters: typeof filters == "string" ? decode(filters.toString()) : {},
            logs: _logs,
            chunk: _chunk,
            chunks: chunks.length,
            limit: limit,
        };
    }
}

export default GetGuildLogs;
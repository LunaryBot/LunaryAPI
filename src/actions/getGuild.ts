import axios, { AxiosResponse } from 'axios';
import Action from '../structures/Action';
import { IContext, IGuild, IGuildSuper } from '../types';

class GetGuildAction extends Action {
    constructor() {
        super({
            op: 'getGuild',
            isGuild: true
        });
    }

    async execute(ctx: IContext, data: any) {
        let guildData = {} as IGuildSuper;
        const res = await (await axios.get(`${process.env.BOT_HOST}/api/guild/${ctx.guildId}`).catch(() => {}))?.data
        
        if(res && res.status == 200) {
            guildData = {
                ...res.data,
                ...((await ctx.dbs.getGuildDatabase(`${ctx.guildId}`)) || {})
            }
        }
        return {
            ...guildData
        };
    }
}

export default GetGuildAction;
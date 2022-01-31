import Action from '../structures/Action';
import { IContext } from '../types';

class PingAction extends Action {
    constructor() {
        super({
            op: 'getGuildSettings',
            isGuild: true
        });
    }

    async execute(ctx: IContext, data: any) {
        const dbData = await ctx.dbs.getGuildDatabase(`${ctx.guildId}`);
        return {
            ...dbData
        };
    }
}

export default PingAction;
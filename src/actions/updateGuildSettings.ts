import Action from '../structures/Action';
import { IContext } from '../types';
const idRegex = /^\d{17,19}$/i
import GuildConfigs from '../utils/GuildConfigs';

const settings: any = {
    modlogs_channel: (value: string) => {
        if(!value || typeof value !== 'string' || !idRegex.test(value)) return false;
        return value;
    },
    punishments_channel: (value: string) => {
        if(!value || typeof value !== 'string' || !idRegex.test(value)) return false;
        return value;
    },
    configs: (value: number|GuildConfigs) => {
        if(value instanceof GuildConfigs) return value.bitfield;
        if(typeof value !== 'number' && isNaN(value)) return false;
        return Number(value);
    }
}

class UpdateGuildSettingsAction extends Action {
    constructor() {
        super({
            op: 'updateGuildSettings',
            isGuild: true
        });
    }

    async execute(ctx: IContext, data: any) {
        const dbData = await ctx.dbs.getGuildDatabase(`${ctx.guildId}`);
        let newdbData: any = {}

        Object.entries(data || {}).forEach(([key, value]: [string, any]) => {
            const _ = settings[key];

            if(_) {
                const _value = _(value);
                if(_value) newdbData[key] = _value;
            }
        });

        newdbData = Object.assign(dbData, newdbData);
        
        return {
            ...newdbData
        };
    }
}

export default UpdateGuildSettingsAction;
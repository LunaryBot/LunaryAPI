import Action from '../structures/Action';
import { IContext } from '../types';
const idRegex = /^\d{17,19}$/i
import GuildConfigs from '../utils/GuildConfigs';

interface IUpdateGuildSettingsData {
    updateType: 'moderation';
    settingsData: any;
}

const SettingsSchema = {
    moderation: {
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
}

class UpdateGuildSettingsAction extends Action {
    constructor() {
        super({
            op: 'updateGuildSettings',
            isGuild: true
        });
    }

    async execute(ctx: IContext, data: IUpdateGuildSettingsData) {
        const { updateType, settingsData } = data || {};
        if(!updateType || !(updateType in SettingsSchema)) return {
            message: 'Invalid update type.'
        }

        if(!settingsData || typeof settingsData !== 'object') return {
            message: 'Invalid settings data.'
        }

        const dbData = await ctx.dbs.getGuildDatabase(`${ctx.guildId}`);
        let newdbData: any = {}
        const SubSchema: any = SettingsSchema[data.updateType];

        Object.entries(settingsData || {}).forEach(([key, value]: [string, any]) => {
            const _ = SubSchema[key];

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
import Action from '../structures/Action';
import { IContext } from '../types';
const idRegex = /^\d{17,19}$/i
import GuildConfigs from '../utils/GuildConfigs';

interface IUpdateGuildSettingsData {
    updateType: 'moderation' | 'permissions';
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
    },
    permissions: (data: { [id: string]: number }, db: any) => {
        if(!data || typeof data !== 'object') return false;

        const permissions: { [id: string]: number } = db?.permissions || {};

        for(const id in data) {
            if(idRegex.test(id) && typeof data[id] == 'number' && !isNaN(data[id])) {
                permissions[id] = Number(data[id]);
            }
        }

        return { permissions };
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

        if(typeof SubSchema == 'object') {
            Object.entries(settingsData || {}).forEach(([key, value]: [string, any]) => {
                const _ = SubSchema[key];

                if(_) {
                    const _value = _(value);
                    if(_value) newdbData[key] = _value;
                }
            });
        } else if(typeof SubSchema == 'function') {
            const _ = SubSchema(settingsData, dbData);
            if(_) newdbData = _;
        }

        newdbData = Object.assign(dbData, newdbData);

        ctx.dbs.guilds.ref(`Servers/${ctx.guildId}`).update(newdbData);
        
        return {
            ...newdbData
        };
    }
}

export default UpdateGuildSettingsAction;
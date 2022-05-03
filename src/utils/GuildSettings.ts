import BitField, { TBit } from "./BitField";

type TGuildConfigsFLAGS =
    'mandatoryReason'
    | 'sendTranscript'

type TGuildConfigsBit = number | TGuildConfigsFLAGS | Array<TGuildConfigsFLAGS|number|BitField> | BitField;

export const Schema = {
    moderation: {
        punishment_channel: (value: string) => {
            if(!value || typeof value !== 'string' || !Number(value)) return false;
            return value;
        },
        configs: (value: number|Configs) => {
            if(value instanceof Configs) return value.bitfield;
            if(typeof value !== 'number' && isNaN(value)) return false;
            return Number(value);
        },
    },
    permissions: (data: { [id: string]: number }, db: any) => {
        if(!data || typeof data !== 'object') return false;

        const permissions: { [id: string]: number } = db?.permissions || {};

        for(const id in data) {
            if(Number(id) && typeof data[id] == 'number' && !isNaN(data[id])) {
                permissions[id] = Number(data[id]);
            };
        };

        return { permissions };
    },
}

export class Configs extends BitField {
    constructor(bits: TBit) {
        super(bits, {
            FLAGS: Configs.FLAGS,
            defaultBit: 0,
        });
    }

    public has(bit: TGuildConfigsBit): boolean {
        return super.has.bind(this)(bit);
    }

    static get FLAGS() {
		return {
            mandatoryReason: 1 << 0,
            sendTranscript: 1 << 1,
        } as { [key in TGuildConfigsFLAGS]: number };
	}
}
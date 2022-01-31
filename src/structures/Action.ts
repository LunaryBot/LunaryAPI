import Databases from './Databases';
import ActionManager from './ActionManager';
import { User, IContext } from '../types'

interface IRequireds {
    permissions?: number;
}

class Action {
    op: string;
    isGuild: boolean;
    requireds: IRequireds;
    
    constructor({op,isGuild, requireds}: {op: string, isGuild?: boolean, requireds?: IRequireds}) {
        this.op = op;
        this.isGuild = !!isGuild;
        this.requireds = {};
    }
    
    async execute(ctx: IContext, data: any): Promise<any> {}
}

export default Action;
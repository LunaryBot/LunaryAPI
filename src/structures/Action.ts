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
    
    async execute(data: any): Promise<any> {}
}

export default Action;
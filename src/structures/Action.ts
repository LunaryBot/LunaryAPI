interface IRequireds {
    permissions?: number;
}

class Action {
    op: string;
    requireds: IRequireds;
    
    constructor({op, requireds}: {op: string, requireds?: IRequireds}) {
        this.op = op;
        this.requireds = {};
    }
    
    async execute(data: any): Promise<any> {}
}

export default Action;
class Action {
    op: string;
    constructor(op: string) {
        this.op = op;
    }
    
    async execute(data: any): Promise<any> {}
}

export default Action;
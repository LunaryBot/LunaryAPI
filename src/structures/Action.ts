class Action {
    op: string;
    constructor(op: string) {
        this.op = op;
    }
    
    execute(data: any) {}
}

export default Action;
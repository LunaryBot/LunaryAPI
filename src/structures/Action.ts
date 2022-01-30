import { Socket } from 'socket.io';

class Action {
    op: string;
    constructor(op: string) {
        this.op = op;
    }
    
    execute(socket: Socket, data: any) {}
}

export default Action;
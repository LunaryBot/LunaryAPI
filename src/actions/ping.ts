import Action from '../structures/Action';

class PingAction extends Action {
    constructor() {
        super({
            op: 'ping'
        });
    }

    async execute() {
        return {
            op: 'pong'
        };
    }
}

export default PingAction;
import Action from '../structures/Action';

class PingAction extends Action {
    constructor() {
        super('ping');
    }

    async execute() {
        return {
            op: 'pong'
        };
    }
}

export default PingAction;
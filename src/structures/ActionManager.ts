import { Socket } from 'socket.io';
import Action from './Action';
import { readdirSync } from 'fs';

class ActionManager {
    private _actions: Action[] = [];
    
    constructor() {
        this._actions = [];

        this.load();
    }

    public execute({op, data = null}: { op: string, data: any}) {
        const action = this._actions.find(a => a.op === op);
        if (!action) {
            return {
                op: 'error',
                data: {
                    message: 'Action not found'
                }
            };
        }

        return action.execute(data);
    }

    public load(): Action[] {
        const actions: Action[] = [];

        const files = readdirSync(process.cwd() + '/dist/actions');
        for (const file of files) {
            const action = require(process.cwd() + '/dist/actions/' + file);
            actions.push(new action.default());
        }

        this._actions = actions;
        return this._actions;
    }
}

export default ActionManager;
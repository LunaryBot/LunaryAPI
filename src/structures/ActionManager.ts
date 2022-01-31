import { Socket } from 'socket.io';
import Action from './Action';
import Databases from './Databases';
import { readdirSync } from 'fs';
import { User } from '../types'

class ActionManager {
    private _actions: Action[] = [];
    private dbs: Databases;
    
    constructor(dbs: Databases) {
        this._actions = [];
        this.dbs = dbs;

        this.load();
    }

    public async execute({
        op, 
        nonce = null,
        user,
        userId,
        guildId = null,
        data = null
    }: { 
        op: string, 
        nonce: string|null,
        user: User,
        userId: string,
        guildId: string|null, 
        data: any
    }): Promise<any> {
        const action = this._actions.find(a => a.op === op);
        if (!action) {
            return {
                op: 'error',
                nonce,
                data: {
                    message: 'Action not found'
                }
            };
        };

        if(action.isGuild && !guildId) {
            return {
                op: 'error',
                nonce,
                data: {
                    message: 'Guild ID not provided'
                }
            };
        }

        return {
            op,
            nonce,
            data: await action.execute({
                dbs: this.dbs,
                manager: this,
                user,
                userId: userId,
                guildId: guildId,
            }, data)
        };
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
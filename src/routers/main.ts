import { Client, User } from 'eris';
import { Router, Express, Request } from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import Gateway from '../structures/Gateway';

import BaseRouter from '../structures/BaseRouter';
import Databases from '../structures/Databases';

class MainRouter extends BaseRouter {
    constructor(data: { dbs: Databases; app: Express, wss: Gateway, client: Client }) {
        super({
            wss: data.wss,
            app: data.app,
            router: Router(),
            dbs: data.dbs,
            path: '*',
            client: data.client
        });
    }
}

export default MainRouter;
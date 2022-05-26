import { Client, User } from 'eris';
import { Router, Express, Request } from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import Gateway from '../structures/Gateway';

import BaseRouter from '../structures/BaseRouter';
import Databases from '../structures/Databases';
import Server from '../structures/Server';

class MainRouter extends BaseRouter {
    constructor(data: { dbs: Databases; server: Server, client: Client }) {
        super({
            server: data.server,
            router: Router(),
            dbs: data.dbs,
            path: '*',
            client: data.client
        });
    }
}

export default MainRouter;
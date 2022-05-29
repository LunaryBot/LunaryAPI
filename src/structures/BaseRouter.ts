import { Client } from 'eris';
import { Router, Express, Request } from 'express';
import { WebSocket } from 'ws';
import Databases from './Databases';
import Gateway from './Gateway';
import Server from './Server';

class BaseRouter {
    public server: Server;
    public app: Express;
    public router: Router;
    public path: string;
    public client: Client;
    public gateway: Gateway;

    public dbs: Databases;
    
    constructor(data: { server: Server; router: Router; path: string; dbs: Databases; client: Client }) {
        this.server = data.server;
        this.app = data.server.app;
        this.router = data.router;
        this.path = data.path;
        this.client = data.client;
        this.gateway = data.server.gateway;

        this.dbs = data.dbs;

        this.app.use(`${this.path}`, this.router);
    }

    public get get() {
        return this.router.get.bind(this.router);
    }

    public get post() {
        return this.router.post.bind(this.router);
    }

    public get patch() {
        return this.router.patch.bind(this.router);
    }

    public get put() {
        return this.router.put.bind(this.router);
    }

    public get delete() {
        return this.router.delete.bind(this.router);
    }

    public get use() {
        return this.router.use.bind(this.router);
    }

    public ws(path: string, callback: (req: Request, ws: WebSocket) => void) {
        this.app.use(`${this.path}${path}`, (req, res) => {
            res.sendWs(callback);
        });
    }
}

export default BaseRouter;
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
    }

    public get get() {
        return this.app.get;
    }

    public get post() {
        return this.app.post;
    }

    public get put() {
        return this.app.put;
    }

    public get delete() {
        return this.app.delete;
    }

    public get use() {
        return this.app.use;
    }

    public get ws() {
        return this.server.ws;
    }
}

export default BaseRouter;
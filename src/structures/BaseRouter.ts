import { Client } from 'eris';
import { Router, Express } from 'express';
import { WebSocketServer } from 'ws';
import Databases from './Databases';

class BaseRouter {
    public app: Express;
    public router: Router;
    public path: string;
    public client: Client;

    public dbs: Databases;
    
    constructor(data: { app: Express; router: Router; path: string; wss: WebSocketServer; dbs: Databases; client: Client }) {
        this.app = data.app;
        this.router = data.router;
        this.path = data.path;
        this.client = data.client;

        this.dbs = data.dbs;

        this.app.use(this.path, this.router);
    }
}

export default BaseRouter;
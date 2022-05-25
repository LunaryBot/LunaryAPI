import { Client } from 'eris';
import { Router, Express } from 'express';
import { WebSocketServer } from 'ws';
import Databases from './Databases';
import Gateway from './Gateway';

class BaseRouter {
    public app: Express;
    public router: Router;
    public path: string;
    public client: Client;
    public gateway: Gateway;

    public dbs: Databases;
    
    constructor(data: { app: Express; router: Router; path: string; wss: Gateway; dbs: Databases; client: Client }) {
        this.app = data.app;
        this.router = data.router;
        this.path = data.path;
        this.client = data.client;
        this.gateway = data.wss;

        this.dbs = data.dbs;
    }
}

export default BaseRouter;
import { Router, Express } from 'express';
import { WebSocketServer } from 'ws';
import Databases from './Databases';

class BaseRouter {
    public app: Express;
    public router: Router;
    public path: string;

    public dbs: Databases;
    
    constructor(data: { app: Express; router: Router; path: string; wss: WebSocketServer; dbs: Databases }) {
        this.app = data.app;
        this.router = data.router;
        this.path = data.path;

        this.dbs = data.dbs;

        this.app.use(this.path, this.router);
    }
}

export default BaseRouter;
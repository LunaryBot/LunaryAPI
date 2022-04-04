import { Router, Express } from 'express';
import { WebSocketServer } from 'ws';

class BaseRouter {
    public app: Express;
    public router: Router;
    public path: string;
    
    constructor(data: { app: Express; router: Router; path: string; wss: WebSocketServer }) {
        this.app = data.app;
        this.router = data.router;
        this.path = data.path;

        this.app.use(this.path, this.router);
    }
}

export default BaseRouter;
import BaseRouter from '../structures/BaseRouter';
import { Router, Express } from 'express';
import { WebSocketServer } from 'ws';
import Utils from '../utils/Utils';

class AuthRouter extends BaseRouter {
    constructor(data: { app: Express, wss: WebSocketServer }) {
        super({
            wss: data.wss,
            app: data.app,
            router: Router(),
            path: '/auth'
        });

        this.router.get('/callback', (req, res) => {
            const { code } = req.query;
            const token = Utils.generateToken();
            res.redirect(`${process.env.WEBSITE_URL}/login?token=${token}`);
        });

        this.router.get('/', (req, res) => {
            res.send('Hey');
        });
    }
}

export default AuthRouter;
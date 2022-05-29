import { Express, Request } from 'express';
import http from 'http';
import Gateway from './Gateway';
import { WebSocket } from 'ws';

class Server extends http.Server {
    public app: Express;
    public gateway: Gateway;

    constructor(app: Express) {
        super(app);

        this.app = app;
        this.gateway = new Gateway(this, { server: this });

        this.on('upgrade', this.handleUpgrade.bind(this));
    }

    private handleUpgrade(req: Request, socket: WebSocket, upgradeHead: Buffer) {
        const wss = this.gateway;
        var res = new http.ServerResponse(req);
        res.assignSocket(socket as any);
    
        var head = Buffer.alloc(upgradeHead.length);

        upgradeHead.copy(head);
    
        res.on('finish', function () {
            res.socket && res.socket.destroy();
        });
    
        res.sendWs = function (callback) {
            wss.handleUpgrade(req, socket as any, head, function (client) {
                //client.req = req; res.req
                wss.emit('connection'+req.url, client);
                wss.emit('connection', client);

                callback?.(req, client);
            });
        };
    
        return this.app(req, res);
    };

    get get() {
        return this.app.get.bind(this.app);
    }

    get post() {
        return this.app.post.bind(this.app);
    }

    get put() {
        return this.app.put.bind(this.app);
    }

    get delete() {
        return this.app.delete.bind(this.app);
    }

    get use() {
        return this.app.use.bind(this.app);
    }

    ws(path: string, callback: (req: Request, ws: WebSocket) => void) {
        this.app.use(path, (req, res) => {
            res.sendWs(callback);
        });
    }
}

export default Server;
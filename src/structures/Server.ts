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
        this.gateway = new Gateway(this, { noServer: true });

        this.on('upgrade', this.handleUpgrade.bind(this));

        this.ws('/test', (req, ws) => {
            console.log('test ws ' + req.originalUrl);
            ws.send(JSON.stringify({ test: 'test ws' }));
        });

        this.ws('/test2', (req, ws) => {
            console.log('test ws ' + req.originalUrl);
            ws.send(JSON.stringify({ test: 'test2 ws' }));
        });
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
        return this.app.get;
    }

    get post() {
        return this.app.post;
    }

    get put() {
        return this.app.put;
    }

    get delete() {
        return this.app.delete;
    }

    get use() {
        return this.app.use;
    }

    ws(path: string, callback: (req: Request, ws: WebSocket) => void) {
        this.app.use(path, (req, res) => {
            res.sendWs(callback);
        });
    }
}

export default Server;
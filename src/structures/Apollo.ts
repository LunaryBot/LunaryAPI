import express, { Express, Request } from 'express';
import http from 'http';
import Gateway from './Gateway';
import { WebSocket } from 'ws';
import { ApolloServer, Config, ExpressContext } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

class Apollo extends ApolloServer {
    public app: Express;
    public httpServer: http.Server;
    public gateway: Gateway;

    constructor(config: Config<ExpressContext>) {
        super(config);

        this.app = express();
        this.httpServer = http.createServer(this.app);

        this.gateway = new Gateway(this);

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(require('cors')());

        this.httpServer.on('upgrade', this.handleUpgrade.bind(this));

        this.plugins = [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })];
    }

    public async init(port?: number | undefined) {
        this.httpServer.listen(port, () => {
            console.log(`🪐 Http Server is running on port ${process.env.PORT} (http://localhost:${process.env.PORT})`);
        })

        await this.start();

        this.applyMiddleware({ app: this.app, path: '/' });

        console.log(`🚀 Apollo GraphQL Server ready at http://localhost:${process.env.PORT}${this.graphqlPath}`)

        return this;
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
                wss.emit('connection'+req.url, client);
                wss.emit('connection', client);

                callback?.(req, client);
            });
        };
    
        return this.app(req, res);
    };
}

export default Apollo;
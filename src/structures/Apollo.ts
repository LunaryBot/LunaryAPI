import { REST } from '@discordjs/rest';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, Config, ExpressContext } from 'apollo-server-express';
import UserController from 'controllers/UserController';
import express, { Express, Request } from 'express';
import http from 'http';
import { WebSocket } from 'ws';

import BaseRouter from '@BaseRouter';

import AuthUtils from '@utils/AuthUtils';

import { MyContext } from '../@types/Server';

import Gateway from './Gateway';
import Redis from './Redis';

class Apollo extends ApolloServer {
	public readonly app: Express;
	public readonly httpServer: http.Server;
	public readonly gateway: Gateway;

	public readonly redis = new Redis(this);

	public readonly apis = {
		discord: new REST({ version: '10' }).setToken(process.env.DISCORD_CLIENT_TOKEN),
	};

	public readonly controllers = {
		users: new UserController(this),
	};

	public idsCache: Map<string, string>;
    
	constructor(config: Config<ExpressContext>, idsCache = new Map<string, string>()) {
		super(config);
        
		this.app = express();
		this.httpServer = http.createServer(this.app);
        
		this.gateway = new Gateway(this);
        
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(require('cors')());
        
		this.httpServer.on('upgrade', this.handleUpgrade.bind(this));
        
		this.plugins = [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })];
        
		this.idsCache = idsCache;

		// @ts-ignore
		this.context = async(context: ExpressContext) => {
			const myContext: MyContext = {
				...context,
				apollo: this,
			};

			const token = context.req.headers?.authorization;

			if(token) {
				myContext.token = token;
				if(idsCache.has(token)) {
					myContext.userId = idsCache.get(token) as string;
				}
                
				const data = await AuthUtils.login.bind({ apollo: this })(token);
        
				if(data?.id) {
					idsCache.set(token, data.id);
    
					myContext.userId = data.id;
				}
			}

			myContext.guildId = context.req.body?.variables?.guildId || undefined;
            
			return myContext;
		};
	}

	get delete() {
		return this.app.delete.bind(this.app);
	}

	get get() {
		return this.app.get.bind(this.app);
	}

	get patch() {
		return this.app.patch.bind(this.app);
	}

	get post() {
		return this.app.post.bind(this.app);
	}

	get put() {
		return this.app.put.bind(this.app);
	}

	get use() {
		return this.app.use.bind(this.app);
	}

	public addRouter(Router: BaseRouter['constructor']) {
		// @ts-ignore
		const routerInstance = new Router(this) as BaseRouter;

		this.app.use(routerInstance.path, routerInstance.router);
	}

	public async init(port?: number | undefined) {
		this.httpServer.listen(port, () => {
			logger.info(`Http Server is running on port ${process.env.PORT} (http://localhost:${process.env.PORT})`, { label: 'Http Server' });
		});

		await this.start();

		this.applyMiddleware({ app: this.app, path: '/graphql' });
        
		logger.graphql(`Apollo GraphQL Server ready at http://localhost:${process.env.PORT}${this.graphqlPath}`, { label: 'Apollo Server' });
        
		return this;
	}

	private handleUpgrade(req: Request, socket: WebSocket, upgradeHead: Buffer) {
		const wss = this.gateway;
		const res = new http.ServerResponse(req);
		res.assignSocket(socket as any);
    
		const head = Buffer.alloc(upgradeHead.length);

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
	}
}

export default Apollo;
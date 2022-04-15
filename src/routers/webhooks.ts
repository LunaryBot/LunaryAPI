import { Client, User } from 'eris';
import { Router, Express } from 'express';
import { WebSocketServer } from 'ws';

import BaseRouter from '../structures/BaseRouter';
import Databases from '../structures/Databases';

class WebhooksRouter extends BaseRouter {
    constructor(data: { dbs: Databases; app: Express, wss: WebSocketServer, client: Client }) {
        super({
            wss: data.wss,
            app: data.app,
            router: Router(),
            dbs: data.dbs,
            path: '/webhooks',
            client: data.client
        });

        this.router.post('/topgg', async(req, res) => {
            const authorization = req.get('authorization');
            if (!authorization || authorization !== process.env.TOPGG_TOKEN) return res.status(401).send();

            const { user: userId } = req.body as { user: string };

            res.status(200).send() //Topgg precisa que seja retornado um 200 (OK) para saber que foi recebido o voto.

            await this.dbs.addVote(userId, 'topgg');
            const user: User = await (this.client.users.get(userId) || this.client.getRESTUser(userId));

            return this.client.createMessage(process.env.VOTES_CHANNEL, `❤ **| Muito obrigada pelo seu voto** \`${user.username}#${user.discriminator}\`**!**`);
        });
    }
}

export default WebhooksRouter;
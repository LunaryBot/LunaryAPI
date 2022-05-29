import express from 'express';
import Databases from './structures/Databases';
import { Client, User } from 'eris';
import Server from './structures/Server';

import AuthRouter from './routers/auth';
import GuildsRouter from './routers/guilds';
import WebhooksRouter from './routers/webhooks';
import UsersRouter from './routers/users';
import MainRouter from './routers/main';

import 'dotenv/config';
import { vCodesWrapper } from './votes/vCodes';

const app = express();
const server = new Server(app);
const client = new Client(process.env.DISCORD_BOT_TOKEN, {
    messageLimit: 0,
    autoreconnect: true,
    intents: ['guilds', 'guildMessages', 'guildMembers', 'guildPresences' /**Caching only */],
    getAllUsers: true,
    ws: { skipUTF8Validations: true },
    defaultImageFormat: 'png',
    defaultImageSize: 2048,
    disableEvents: { CHANNEL_PINS_UPDATE: true }
});

client.presence = {
    since: Date.now(),
    afk: true,
    status: 'dnd',
    activities: [{ type: 3, name: 'Lunary API', created_at: Date.now() }]
}

const dbs = new Databases();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cors')());

[AuthRouter, GuildsRouter, WebhooksRouter, UsersRouter, MainRouter].map(router => new router({ server, dbs, client }));

app.get('/ping', (req, res) => res.json({ message: 'pong' }));

client.on('messageCreate', async(message) => {
    switch(message.webhookID) {
        case '964351453667921971': {
            const userId: any = message.embeds[0].footer?.text.split(' • ')[0];
            await dbs.addVote(userId, 'bestlist');
            const user: User = await (client.users.get(userId) || client.getRESTUser(userId));
            return client.createMessage(process.env.VOTES_CHANNEL, `❤ **| Muito obrigada pelo seu voto** \`${user.username}#${user.discriminator}\`**!**`);
        }
    }
})

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} (http://localhost:${process.env.PORT})`);
    return client.connect().then(() => console.log('Discord bot running.'));
});
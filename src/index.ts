import 'reflect-metadata';
import 'dotenv/config';
import './utils/Logger';

import { buildSchema } from 'type-graphql';

import Databases from './structures/Databases';
import { Client, User } from 'eris';
import path from 'path';
import Apollo from './structures/Apollo';

import AuthRouter from './routers/auth';
import GuildsRouter from './routers/guilds';
import WebhooksRouter from './routers/webhooks';
import UsersRouter from './routers/users';
import MainRouter from './routers/main';

import AuthResolver from './resolvers/AuthResolver';
import UsersResolver from './resolvers/UsersResolver';
import GuildsResolver from './resolvers/GuildsResolver';
import PunishmentsResolver from './resolvers/PunishmentsResolver';

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

client.on('messageCreate', async(message) => {
    switch(message.webhookID) {
        case '964351453667921971': {
            const userId: any = message.embeds[0].footer?.text.split(' • ')[0];
            await dbs.addVote(userId, 'bestlist');
            const user: User = await (client.users.get(userId) || client.getRESTUser(userId));
            return client.createMessage(process.env.VOTES_CHANNEL, `❤ **| Muito obrigada pelo seu voto** \`${user.username}#${user.discriminator}\`**!**`);
        }
    }
});

async function main() {
    const schema = await buildSchema({
        resolvers: [
            AuthResolver,
            UsersResolver,
            GuildsResolver,
            PunishmentsResolver,
        ],
        emitSchemaFile: path.resolve(process.cwd(), 'schema.graphql'),
    });

    const server = new Apollo({
        schema,
        csrfPrevention: true,
        formatError: ({ message = 'Internal Server Error'}) => ({ message }),
    });

    global.apollo = server;
    global.dbs = dbs;
    global.gateway = server.gateway;

    ([AuthRouter, GuildsRouter, WebhooksRouter, UsersRouter, MainRouter]).map(router => new router({ server, dbs, client }));

    server.init(Number(process.env.PORT));
}

main();
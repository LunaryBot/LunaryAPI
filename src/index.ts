import 'reflect-metadata';
import 'dotenv/config';
import './utils/Logger';

import { buildSchema, ResolverData } from 'type-graphql';
import { gql } from 'graphql-request';
import path from 'path';

import Databases from './structures/Databases';
import Apollo from './structures/Apollo';

import AuthRouter from './routers/AuthRouter';
import GuildsRouter from './routers/GuildsRouter';
import WebhooksRouter from './routers/WebhooksRouter';
import UsersRouter from './routers/UsersRouter';
import MainRouter from './routers/MainRouter';

import AuthResolver from './resolvers/AuthResolver';
import UsersResolver from './resolvers/UsersResolver';
import GuildsResolver from './resolvers/GuildsResolver';
import PunishmentsResolver from './resolvers/PunishmentsResolver';
import { ExpressContext } from 'apollo-server-express';

import { MyContext } from './@types/Server'

import Utils from './utils/Utils';
import client from './utils/BotAPIClient';
import authChecker from './utils/AuthChecker';
import ApiError from './utils/ApiError';

import bot from './bot';

const dbs = new Databases();

const errorRegex = /^(.*)\:\s?(\d*)(\:\s?.*)?$/;

async function main() {
    const schema = await buildSchema({
        resolvers: [
            AuthResolver,
            UsersResolver,
            GuildsResolver,
            PunishmentsResolver,
        ],
        emitSchemaFile: path.resolve(process.cwd(), 'schema.graphql'),
        authChecker,
    });

    const usersIdCache = new Map<string, string>([['test', '588032504796282893']]);

    const server = new Apollo({
        schema,
        csrfPrevention: true,
        formatError: ({ message = 'Internal Server Error' }: ApiError) => {
            const status = message.startsWith('Access denied') ? 403 : Number(message.replace(errorRegex, '$2'));
            message = message.startsWith('Access denied') ? 'Missing Permissions' : message.replace(errorRegex, '$1');
            
            return ({ message, status });
        },
        context: async(context) => {
            const myContext: MyContext = {
                ...context,
            };

            const token = context.req.headers?.authorization;

            if(token) {
                if(usersIdCache.has(token)) {
                    myContext.userId = usersIdCache.get(token) as string;
                }
                
                const d = await Utils.login(token);
        
                const { status, ...data } = d;
        
                if(status == 200 && data?.id) {
                    usersIdCache.set(token, data.id);
    
                    myContext.userId = data.id;
                }
            }

            myContext.guildId = context.req.body?.variables?.guildId || undefined;
            
            return myContext;
        },
    }, usersIdCache);

    global.apollo = server;
    global.dbs = dbs;
    global.gateway = server.gateway;

    ([AuthRouter, GuildsRouter, WebhooksRouter, UsersRouter, MainRouter]).map(router => new router({ server, dbs, client: bot }));

    server.init(Number(process.env.PORT));
}

main();
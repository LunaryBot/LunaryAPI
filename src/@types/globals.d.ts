import type { IUser } from './index';
import { Logger } from 'winston';

import Apollo from '../structures/Apollo';
import Databases from '../structures/Databases';
import Gateway from '../structures/Gateway';

interface MyLogger extends Logger {
    readonly graphql: LeveledLogMethod;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly NODE_ENV: 'development' | 'production' | 'test';
            readonly WEBSITE_URL: string;
            readonly BOT_API_URL: string;
            readonly BOT_API_TOKEN: string;
            readonly JWT_SECRET: string;

            readonly DISCORD_BOT_TOKEN: string;
            readonly VOTES_CHANNEL: string;

            readonly DISCORD_CLIENT_TOKEN: string;
            readonly DISCORD_CLIENT_SECRET: string;
            readonly DISCORD_CLIENT_ID: string;

            readonly TOPGG_TOKEN: string;
            readonly VCODES_TOKEN: string;
        }
    }

    var apollo: Apollo;
    var dbs: Databases;
    var gateway: Gateway;
    var logger: MyLogger;
}

export {};
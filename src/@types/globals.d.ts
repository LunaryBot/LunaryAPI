import { Logger } from 'winston';

import Apollo from '../structures/Apollo';
import Gateway from '../structures/Gateway';

interface MyLogger extends Logger {
    readonly graphql: LeveledLogMethod;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly NODE_ENV: 'development' | 'production' | 'test';
            readonly WEBSITE_URL: string;
            readonly JWT_SECRET: string;

            readonly DISCORD_CLIENT_TOKEN: string;
            readonly DISCORD_CLIENT_SECRET: string;
            readonly DISCORD_CLIENT_ID: string;

            readonly TOPGG_TOKEN: string;
            readonly VCODES_TOKEN: string;
        }
    }

    var apollo: Apollo;
    var gateway: Gateway;
    const logger: MyLogger;
}

export {};
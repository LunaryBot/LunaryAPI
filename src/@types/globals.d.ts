import { Logger } from 'winston';

import type _Apollo from '../structures/Apollo';

interface MyLogger extends Logger {
    readonly graphql: LeveledLogMethod;
	readonly rest: LeveledLogMethod;
	readonly gateway: LeveledLogMethod;

    readonly child: () => MyLogger;
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

    declare type Apollo = _Apollo;
    const logger: MyLogger;
}

export {};
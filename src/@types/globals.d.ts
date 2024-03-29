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
            readonly DISCORD_OAUTH2_REDIRECT_URL: string;

            readonly REDIS_URL: string;
            readonly DATABASE_URL: string;

            readonly TOPGG_TOKEN: string;
            readonly VCODES_TOKEN: string;
        }
    }

    interface String {
        checkSimilarityStrings(string: string): number;
        firstCharInLowerCase(): string;
        firstCharInUpperCase(): string;
        isLowerCase(): boolean;
        isUpperCase(): boolean;
        removeAccents(): string;
        shorten(length: number): string;
        toTitleCase(): string;
        wordWrap(maxWidth: number): string
    }

    declare type Apollo = _Apollo;
    const logger: MyLogger;
}

export {};
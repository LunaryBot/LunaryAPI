import type { User } from './index';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly NODE_ENV: 'development' | 'production' | 'test';
            readonly WEBSITE_URL: string;
            readonly BOT_URL: string;
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

    namespace Express {
        interface Request {
            user: User;
        }
    }
};

export {};
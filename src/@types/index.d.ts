declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly NODE_ENV: 'development' | 'production' | 'test';
            readonly WEBSITE_URL: string;
            readonly BOT_URL: string;

            readonly DISCORD_CLIENT_TOKEN: string;
            readonly DISCORD_CLIENT_SECRET: string;
            readonly DISCORD_CLIENT_ID: string;
        }
    }
}

export {}
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly NODE_ENV: 'development' | 'production' | 'test';
            readonly WEBSITE_URL: string;
            readonly BOT_URL: string;
        }
    }
}

export {}
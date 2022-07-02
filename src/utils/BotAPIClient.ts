import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient(process.env.BOT_API_URL, {
    headers: {
        Authorization: process.env.BOT_API_TOKEN,
    },
});

export default client;
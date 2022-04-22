import { WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';
import Databases from './structures/Databases';

import AuthRouter from './routers/auth';
import GuildsRouter from './routers/guilds';

import 'dotenv/config';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const dbs = new Databases();

app.use(express.urlencoded({ extended: false }));
app.use(require('cors')());

new AuthRouter({ app, wss, dbs });
new GuildsRouter({ app, wss, dbs });

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} (http://localhost:${process.env.PORT})`);
});
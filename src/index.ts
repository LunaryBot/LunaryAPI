import { WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';

import AuthRouter from './routers/auth';

import 'dotenv/config';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.urlencoded({ extended: false }));
app.use(require('cors')());

new AuthRouter({ app, wss });

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} (http://localhost:${process.env.PORT})`);
});
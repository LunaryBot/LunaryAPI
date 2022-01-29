import express, { Request, Response } from 'express';
import { Socket } from 'socket.io';

require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.urlencoded({ extended: false }));
app.use(require('cors')());

io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('message', (message: string) => {
        console.log(`message: ${message}`);
    });
});

server.listen(1);
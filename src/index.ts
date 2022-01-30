import express, { Request, Response } from 'express';
import { Socket } from 'socket.io';
import ActionManager from './structures/ActionManager';

require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const manager = new ActionManager();

app.use(express.urlencoded({ extended: false }));
app.use(require('cors')());

io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.onAny(async(event: string, data: any) => {
        data = { 
            op: event,
            nonce: data?.nonce || null,
            data: data?.data
        }

        const { op, ..._data } = await manager.execute(data);

        socket.emit(op, _data);
    });
});


server.listen(1);
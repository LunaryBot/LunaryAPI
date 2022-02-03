import axios from 'axios';
import express, { Request, Response } from 'express';
import { Socket } from 'socket.io';
import ActionManager from './structures/ActionManager';
import { URLS, User } from './types';
import Databases from './structures/Databases';

require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const dbs = new Databases();
const manager = new ActionManager(dbs);

app.use(express.urlencoded({ extended: false }));
app.use(require('cors')());

io.on('connection', async(socket: Socket) => {
    const { token } = socket.handshake.query;

    console.log(`Socket connected: ${socket.id}`);

    if(!token) {
        return disconnect('No token provided');
    }
    
    const user = (await axios.get(URLS.USER, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).catch(() => {}))?.data as User;

    if(!user) {
        return disconnect('Invalid token');
    }

    socket.onAny(async(event: string, data: any) => {
        console.log(`Socket event: ${event}`);
        if(event === 'disconnect') {
            return;
        };

        const { op, ..._data } = await manager.execute({
            op: event,
            nonce: data?.nonce || null,
            guildId: data?.guildId || null,
            data: data?.data,
            user,
            userId: user.id
        });

        socket.emit(op, _data);
    });

    function disconnect(message: string) {
        socket.emit('error', {
            data: {
                message
            }
        });
        
        socket.disconnect();
        console.log(`Socket disconnected: ${socket.id}`);
        return;
    }
});


server.listen(3000);
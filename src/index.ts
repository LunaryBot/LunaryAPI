import axios from 'axios';
import express, { Request, Response } from 'express';
import { Socket } from 'socket.io';
import ActionManager from './structures/ActionManager';
import { IGuildSuper, URLS, User, IGuildData } from './types';
import { Permissions } from './Constants';
import Databases from './structures/Databases';
import GetGuildAction from './actions/getGuild';

require('dotenv').config();

const ps = Permissions.ADMINISTRATOR;

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
const getGuild = new GetGuildAction();

app.use(express.urlencoded({ extended: false }));
app.use(require('cors')());

io.on('connection', async(socket: Socket) => {
    const { token, guildId, fetchGuilds } = socket.handshake.query;

    console.log(`Socket connected: ${socket.id}`);

    if(!token) {
        return disconnect('No token provided');
    }
    
    const user = (await axios.get(URLS.USER, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).catch(() => {}))?.data as User;

    if(!user?.id) {
        return disconnect('Invalid token');
    }

    const data: { user: User, guild?: IGuildSuper, guilds?: IGuildData[] } = { user };

    if((guildId && typeof guildId == 'string') || fetchGuilds) {
        const guilds = (await axios.get(URLS.GUILDS, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(() => {}))?.data as IGuildData[];

        data.guilds = guilds;

        if(guildId) {
            const guild = guilds?.find(g => g.id == guildId);

            if(!guild || (!guild.owner && !((guild.permissions & ps) == ps))) {
                return disconnect('Missing Access');
            };

            const guildData = await getGuild.execute({
                dbs,
                guildId: guild.id,
                user,
                userId: user.id,
                manager,
            }, null);


            data.guild = guildData;
        };
    }

    socket.emit('ready', { data: { ...data } })

    socket.onAny(async(event: string, data: any) => {
        console.log(`Socket event: ${event}`);
        if(event === 'disconnect') {
            return;
        };

        const { op, ..._data } = await manager.execute({
            op: event,
            nonce: data?.nonce || null,
            guildId: guildId?.toString() || null,
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


server.listen(1);
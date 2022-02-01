import axios from 'axios';
import { User } from '../types';
require("dotenv").config();

const fetchTokens = `${process.env.DISCORD_TOKENS}`.split(',');
let { users }: { users: Map<string, User|undefined> } = globalThis as any;

const UnknownUser = {
    id: "0".repeat(18),
    username: "Unknown",
    discriminator: "0000",
    avatar: null,
    public_flags: 0,
}

async function getUser(userId: string): Promise<User|undefined>  {
    if(!users || !(users instanceof Map)) users = new Map();
    
    let user: User|undefined = users.get(userId);

    if(!user) {
        try {
            user = (await axios.get(`https://discord.com/api/v9/users/${userId}`, { 
                headers: {
                    Authorization: `Bot ${fetchTokens[Math.floor(Math.random() * fetchTokens.length)]}` 
                } 
            })).data
        } catch(_) {
            user = UnknownUser;
        }

        users.set(userId, user);
    }

    return user
}

export default getUser;
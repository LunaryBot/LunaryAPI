import Databases from "./structures/Databases";
import ActionManager from "./structures/ActionManager";

export enum URLS {
	BASE = 'https://discord.com/api/oauth2/authorize',
	TOKEN = 'https://discord.com/api/oauth2/token',
	REVOKE = 'https://discord.com/api/oauth2/token/revoke',
	USER = 'https://discord.com/api/users/@me',
	GUILDS = 'https://discord.com/api/users/@me/guilds',
}

export interface User {
	username: string;
	id: string;
	discriminator: string;
	avatar: string|null;
	public_flags: number;
	banner?: string;
	banner_color?: string;
	accent_color?: number;
	flags?: number;
	locale?: string;
	email?: string;
	mfa_enabled?: boolean;
	verified?: boolean;
}

export interface GuildData {
	icon: string;
	id: string;
	name: string;
	owner: boolean;
	permissions: number;
	features: string[];
	permissions_new: string;
}

export interface IContext {
    dbs: Databases;
    manager: ActionManager;
    user: User;
    userId: string;
    guildId: string|null;
}

export type Tbit = string | number | bigint | object | any[];

export interface ILog {
	id: string;
	type: number;
	reason: string;
	date: number;
	time?: number;
	user: string|User;
	author: string|User;
	server: string;
}
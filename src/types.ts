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

export interface IGuildData {
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

export interface IChannel {
	id: string;
	name: string;
	type: string;
	deleted: boolean;
	guildId: string;
	guild: string;
	parentId: string;
	permissionOverwrites: string[];
	nsfw: boolean;
	position: number;
	rawPosition: number;
	topic: string|null;
	lastMessageId: string|null;
	rateLimitPerUser: number;
	createdTimestamp: number;
}

export interface IRole {
	id: string;
	name: string;
	color: number;
	hoist: boolean;
	position: number;
	permissions: number;
	managed: boolean;
	mentionable: boolean;
	createdTimestamp: number;
	deleted: boolean;
	icon: string|null;
	rawPosition: number;
	unicodeEmoji: boolean;
	guild: string;
}

export interface IGuild {
	name: string;
	id: string;
	icon: string;
	channels: IChannel[];
	roles: IRole[];
	shardID: number;
	cluserID: string;
}

export interface IGuildSuper extends IGuild {
	modlogs_channel: string;
	punishments_channel: string;
	configs: number;
}
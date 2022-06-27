export interface IChannel {
	id: string;
	name: string;
	type: number;
	parentID: string;
	nsfw: boolean;
	position: number;
	topic: string;
	lastMessageID: string;
	rateLimitPerUser: number;
	createdAt: number;
	userLimit: number;
	rtcRegion: string;
	bitrate: number;
}

export interface IGuild {
	icon: string;
	id: string;
	name: string;
	owner: boolean;
	permissions: number;
	features: string[];
	permissions_new: string;
	access?: boolean;
	channels?: Array<IChannel>;
	roles?: Array<IRole>;
}

export interface IMember {
	id: string;
	createdAt: number;
	communicationDisabledUntil: number;
	premiumSince: number;
	nick: string;
	roles: string[];
	permissions: number;
}

export interface IPunishmentLog {
	timestamp: number;
	user: string;
	guild: string;
	reason?: string;
	type: 1 | 2 | 3 | 4;
	duration?: number;
	author: string;
}

export interface IPunishmentLogResolved extends IPunishmentLog {
	user: IUser;
	author: IUser;
	guild: IGuild;
	id: string;
}

export interface IPunishmentLogsFilter {
	authorId: string;
	userId?: string;
	guildId?: string;
	afterTimestamp?: number;
	beforeTimestamp?: number;
	type?: string | number;
	limit?: number;
}

export interface IRole {
	id: string;
	name: string;
	color: number;
	hoist: boolean;
	position: number;
	permissions: object;
	managed: boolean;
	mentionable: boolean;
	createdAt: number;
	icon: string|null;
	unicodeEmoji: string;
}

export interface IUser {
	username: string;
	id: string;
	discriminator: string;
	avatar: string;
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

export interface IVoteData {
	platform: string,
	date: number
}
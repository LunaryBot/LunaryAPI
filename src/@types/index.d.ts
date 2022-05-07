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

export interface Guild {
	icon: string;
	id: string;
	name: string;
	owner: boolean;
	permissions: number;
	features: string[];
	permissions_new: string;
}

export interface VoteData {
	platform: string,
	date: number
}
export const URLS = {
	BASE: 'https://discord.com/api/oauth2/authorize',
	TOKEN: 'https://discord.com/api/oauth2/token',
	REVOKE: 'https://discord.com/api/oauth2/token/revoke',
	USER: 'https://discord.com/api/users/@me',
	GUILDS: 'https://discord.com/api/users/@me/guilds',
};

export const GuildFeatures = {
	mandatoryReasonToBan: 1n << 0n,
	mandatoryReasonToKick: 1n << 1n,
	mandatoryReasonToMute: 1n << 2n,
	mandatoryReasonToAdv: 1n << 3n,
	useHTMLTranscript: 1n << 4n,
};
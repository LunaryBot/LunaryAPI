export const URLS = {
	BASE: 'https://discord.com/api/oauth2/authorize',
	TOKEN: 'https://discord.com/api/oauth2/token',
	REVOKE: 'https://discord.com/api/oauth2/token/revoke',
	USER: 'https://discord.com/api/users/@me',
	GUILDS: 'https://discord.com/api/users/@me/guilds',
};

export const GuildFeatures = {
	// Mandatory Reason
	mandatoryReasonToBan: 1n << 0n,
	mandatoryReasonToKick: 1n << 1n,
	mandatoryReasonToMute: 1n << 2n,
	mandatoryReasonToAdv: 1n << 3n,

	// Transcript
	useHTMLTranscript: 1n << 4n,
};

export const GuildPermissions = {
	lunarBanMembers: 1n << 0n,
	lunarKickMembers: 1n << 1n,
	lunarMuteMembers: 1n << 2n,
	lunarAdvMembers: 1n << 3n,
	lunarPunishmentOutReason: 1n << 4n,
	lunarViewHistory: 1n << 5n,
	lunarManageHistory: 1n << 6n,
};

export const UserFeatures = {
	quickPunishment: 1n << 0n,
	useGuildLocale: 1n << 1n,
	useDiscordLocale: 1n << 2n,
};
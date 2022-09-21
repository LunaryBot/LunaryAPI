import { Guild } from '@prisma/client';

import ApiError from '@utils/ApiError';
import GuildFeatures from '@utils/GuildFeatures';
import { Utils } from '@utils/Utils';

const discordIdRegex = /^\d{16,20}$/;

const GuildGeneralSettingsFeatures = GuildFeatures.resolve([
	'mandatoryReasonToBan',
	'mandatoryReasonToAdv',
	'mandatoryReasonToKick',
	'mandatoryReasonToMute',
	'useHTMLTranscript',
]);

type GuildGeneralSettings = Partial<Pick<Guild, 'modlogs_channel' | 'punishments_channel'> & { features: Array<keyof typeof GuildFeatures.Flags> }>;

function GuildGeneralSettingsValidation(newData: GuildGeneralSettings, currentData: Guild) {
	const errors = [];

	const data: Omit<GuildGeneralSettings, 'features'> & { features?: bigint | null } = {};

	if(
		newData.features?.includes('useHTMLTranscript') && 
		!(currentData.premium_type && Utils.isPremium(currentData.premium_until))
	) {
		if(((currentData.features || 0n) & GuildFeatures.Flags.useHTMLTranscript) == GuildFeatures.Flags.useHTMLTranscript) {
			newData.features = newData.features.filter(feature => feature !== 'useHTMLTranscript');
		} else {
			const indexs = newData.features.map((feature, index) => feature === 'useHTMLTranscript' && index).filter(x => typeof x == 'number') as number[];

		    errors.push(...indexs.map(index => `raw.features.${index}: required premium to this feature (useHTMLTranscript)`));
		}
	}

	(['modlogs_channel', 'punishments_channel']).map(channel => {
		const value = (newData as any)[channel];
		if(value && !discordIdRegex.test(value)) {
			errors.push(`raw.${channel}: invalid id`);
		} else {
			(data as any)[channel] = value;
		}
	});

	if(errors.length) throw new ApiError(errors.join(' | '), 400);

	const features = GuildFeatures.resolve((newData.features || []).filter(feature => GuildFeatures.Flags[feature] !== undefined));
	
	data.features = ((currentData.features || 0n) & ~GuildGeneralSettingsFeatures) | features;

	return data;
}

export { GuildGeneralSettingsValidation };
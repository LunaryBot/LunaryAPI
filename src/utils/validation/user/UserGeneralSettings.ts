import { User } from '@prisma/client';

import { UserFeatures } from '@Database';

const UserGeneralSettingsFeatures = [
	'quickPunishment',
	'useGuildLocale',
] as Array<keyof typeof UserFeatures['Flags']>;

const UserGeneralSettingsFeaturesBits = UserFeatures.resolve(UserGeneralSettingsFeatures);

interface UserGeneralSettingsInput {
    features: typeof UserGeneralSettingsFeatures;
}

function UserGeneralSettingsValidation(raw: UserGeneralSettingsInput, currentData: User) {
	const newData: { features?: bigint } = {};

	const features = UserFeatures.resolve((raw.features || []).filter(feature => UserFeatures.Flags[feature] !== undefined));
	
	newData.features = ((currentData.features || 0n) & ~UserGeneralSettingsFeaturesBits) | features;

	return newData;
}

export { UserGeneralSettingsValidation };
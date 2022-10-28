import { PunishmentType, Reason } from '@prisma/client';

import ApiError from '@utils/ApiError';
import Schema from '@utils/Schema';
import { ReasonSchema } from '@utils/schemas';

const _types = Object.keys(PunishmentType);

const ReasonArray = new Schema([ReasonSchema] as any);

const maxMuteDuration = 28 * 1000 * 60 * 60 * 24;
const minMuteDuration = 1 * 1000;

const days = [0, 1, 7];

function GuildReasonsValidation(data: (Omit<Reason, 'guild_id' | 'id'> & { id?: number })[]) {
	const errors: string[] = [];

	const reasons = data.map((reason, index) => {
		const types = [ ...new Set(reason.types.filter(_types.includes.bind(_types))) ];

		if(types.length <= 0) {
			errors.push(`raw[${index}].types: this field is required`);
		}

		if(typeof reason.duration == 'number' && (reason.duration < minMuteDuration || reason.duration > maxMuteDuration)) {
			errors.push(`raw[${index}].duration: invalid duration`);
		}

		if(typeof reason.days == 'number' && !days.includes(reason.days)) {
			errors.push(`raw[${index}].days: invalid days`);
		}
		
		return ({
			...reason,
			types,
		});
	});

	if(errors.length) throw new ApiError('Invalid Raw', 400, errors);

	return ReasonArray.parse(reasons) as any as (Omit<Reason, 'guild_id' | 'id'> & { id?: number })[];
}

export { GuildReasonsValidation };
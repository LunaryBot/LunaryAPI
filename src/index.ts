import 'dotenv/config';
import 'reflect-metadata';
import './tools/Logger.js';

import { buildSchema, Maybe } from 'type-graphql';
import path from 'path';

import Apollo from './structures/Apollo.js';
import { authChecker } from './utils/AuthChecker.js';
import ApiError from './utils/ApiError.js';

async function main() {
	const schema = await buildSchema({
		resolvers: [path.join(__dirname, './resolvers/**/*')],
		emitSchemaFile: path.resolve(process.cwd(), 'schema.graphql'),
		authChecker,
	});

	const apollo = new Apollo({ 
		schema,
		csrfPrevention: true,
		// @ts-ignore
		formatError: ({ originalError }: { originalError: Maybe<ApiError|Error> }) => {
			const error = {
				message: originalError?.message ?? 'Internal server error',
				status: (originalError as ApiError)?.status ?? 500,
			};

			if(!(originalError instanceof ApiError)) {
				logger.error((originalError as Error).message, { label: 'Process', details: originalError?.stack });
			}

			return error;
		}
	});
	await apollo.init(Number(process.env.PORT));
}

main();
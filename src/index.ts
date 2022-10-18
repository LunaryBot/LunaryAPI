import 'dotenv/config';
import 'reflect-metadata';
import './tools/Logger';
import './tools/String';

import { GraphQLError } from 'graphql';
import path from 'node:path';
import { buildSchema } from 'type-graphql';

import AuthRouter from '@routers/AuthRouter';

import Apollo from './structures/Apollo';
import ApiError from './utils/ApiError';
import { authChecker } from './utils/AuthChecker';

async function main() {
	const schema = await buildSchema({
		resolvers: [path.join(__dirname, './resolvers/**/*Resolver*')],
		emitSchemaFile: path.resolve(process.cwd(), 'schema.graphql'),
		authChecker,
	});

	const apollo = new Apollo({ 
		schema,
		csrfPrevention: true,
		formatError: (error: GraphQLError) => {
			const { originalError } = error;

			const errorFormated = {
				message: originalError?.message ?? 'Internal server error',
				status: (originalError as ApiError)?.status ?? 500,
				stacks: (originalError as ApiError)?.stacks,
			};
			
			if(!(originalError instanceof ApiError) && !(error instanceof GraphQLError)) {
				logger.error((error as Error).message, { label: 'Process', details: (error as Error)?.stack || undefined });
			}

			return errorFormated;
		},
	});

	await apollo.init(Number(process.env.PORT));

	([AuthRouter]).forEach(apollo.addRouter.bind(apollo));
}

main();
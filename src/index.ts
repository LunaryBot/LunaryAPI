import 'dotenv/config';
import 'reflect-metadata';
import './tools/Logger';
import './tools/String';

import { GraphQLError } from 'graphql';
import path from 'node:path';
import { buildSchema } from 'type-graphql';

import { UserInventory } from '@Database';

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
			const { extensions: { exception } = {} } = error;

			const errorFormated = {
				message: error.message ?? 'Internal server error',
				status: (exception ?? error as ApiError)?.status ?? 500,
				stacks: (exception ?? error as ApiError)?.stacks,
			};
			
			if(!(error instanceof ApiError) && !(error instanceof GraphQLError)) {
				logger.error((error as Error).message, { label: 'Process', details: (error as Error)?.stack || undefined });
			}

			return errorFormated;
		},
	});

	await apollo.init(Number(process.env.PORT));

	([AuthRouter]).forEach(apollo.addRouter.bind(apollo));

	// await apollo.prisma.shopItem.createMany({
	// 	data: [
	// 		{
	// 			type: 'BACKGROUND',
	// 			name: '"Noot Noot"',
	// 			description: 'Pingu is scared',
	// 			price: 20000,
	// 			rarity: 'RARE',
	// 			assets: {
	// 				link: 'https://imgur.com/XQ04JDV.png',
	// 			},
	// 		},
	// 	],
	// });

	await apollo.controllers.shop.init();
}

process.on('uncaughtExceptionMonitor', (err) => {
	logger.error(err.message, { label: 'Process', details: err.stack });
});

main();
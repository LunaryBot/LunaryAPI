import 'dotenv/config';
import 'reflect-metadata';
import './tools/Logger';

import path from 'path';
import AuthRouter from 'routers/AuthRouter';
import { buildSchema, Maybe } from 'type-graphql';

import AuthUtils from '@utils/AuthUtils';

import { MyContext } from './@types/Server';

import Apollo from './structures/Apollo';
import ApiError from './utils/ApiError';
import { authChecker } from './utils/AuthChecker';

async function main() {
	const schema = await buildSchema({
		resolvers: [path.join(__dirname, './resolvers/**/*')],
		emitSchemaFile: path.resolve(process.cwd(), 'schema.graphql'),
		authChecker,
	});

	const idsCache = new Map<string, string>();

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
		},
		context: async(context) => {
			const myContext: MyContext = {
				...context,
			};

			const token = context.req.headers?.authorization;

			if(token) {
				myContext.token = token;
				if(idsCache.has(token)) {
					myContext.userId = idsCache.get(token) as string;
				}
                
				const data = await AuthUtils.login(token);
        
				if(data?.id) {
					idsCache.set(token, data.id);
    
					myContext.userId = data.id;
				}
			}

			myContext.guildId = context.req.body?.variables?.guildId || undefined;
            
			return myContext;
		},
	}, idsCache);

	await apollo.init(Number(process.env.PORT));

	([AuthRouter]).forEach(apollo.addRouter.bind(apollo));
}

main();
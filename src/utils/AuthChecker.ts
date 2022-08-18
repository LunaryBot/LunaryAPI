import { AuthChecker, ResolverData } from 'type-graphql';
import { MyContext } from '../@types/Server';

import ApiError from './ApiError';

const authChecker: AuthChecker<any, any> = async({ root, context }: ResolverData<MyContext>, permissions?: Array<bigint>) => {
	const { userId, guildId, token } = context;

	if(token && !userId) throw new ApiError('Invalid/Expired token', 401);

	if(!userId) throw new ApiError('No token provided');

	console.log(root);

	return true;
};

export { authChecker };
import { AuthChecker, ResolverData } from 'type-graphql';

import GuildsResolver from '../resolvers/GuildsResolver';

import { MyContext } from '../@types/Server';
import ApiError from './ApiError';

const authChecker: AuthChecker<any, any> = async({ context }: ResolverData<MyContext>, permissions: Array<bigint>) => {
	const { userId, guildId, token } = context;

	if(token && !userId) throw new ApiError('Invalid/Expired token', 401);

	if(!userId) throw new ApiError('No token provided', 401);

	const has = await (async() => {
		if(permissions) {
			if(permissions.length > 0) {
				if(!guildId) return false;
    
				const member = await GuildsResolver.getMember(guildId, userId);
                
				if(!member) {
					return false;
				}
        
				const permissionsResolved = permissions.reduce((a, b) => a | b, BigInt(0));
        
				return (BigInt(member.permissions) & permissionsResolved) === permissionsResolved;
			} else return true;
		}
    
		return true;
	})();

	if(!has) throw new ApiError('Missing Permissions', 403);

	return true;
};

export default authChecker;
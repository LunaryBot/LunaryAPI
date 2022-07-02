import { ResolverData } from 'type-graphql';

import GuildsResolver from '../resolvers/GuildsResolver';

import { MyContext } from '../@types/Server';
import ApiError from './ApiError';

export default async function authChecker({ context }: ResolverData<MyContext>, permissions: Array<bigint>) {
    const { userId, guildId } = context;

    if(!userId) throw new ApiError('No token provided', 401);

    if(userId && guildId) {
        const member = await GuildsResolver.getMember(guildId, userId);
        
        if(!member) {
            return false;
        }

        const permissionsResolved = permissions.reduce((a, b) => a | b, BigInt(0));

        return (BigInt(member.permissions) & permissionsResolved) === permissionsResolved;
    };

    return true;
}
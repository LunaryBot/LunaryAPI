import { Resolver, Query, Arg } from 'type-graphql';

import User from '../models/User';

import Utils from '../utils/Utils';

@Resolver()
class AuthResolver {
    @Query(() => User)
    async Auth( @Arg('token') token: string ) {
        const d = await Utils.login(token);

        const { status, ...data } = d;

        return data;
    }
}

export default AuthResolver;
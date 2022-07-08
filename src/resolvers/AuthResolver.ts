import { Resolver, Query, Arg } from 'type-graphql';

import User from '../models/User';

import Utils from '../utils/Utils';
import ApiError from '../utils/ApiError';

@Resolver()
class AuthResolver {
    @Query(() => User)
	async Auth( @Arg('token') token: string ) {
		const d = await Utils.login(token);

		const { status, ...data } = d;

		if(status == 200) {
			apollo.idsCache.set(token, data.id);
		} else {
			throw new ApiError(data?.message as string, status);
		}

		return data;
	}
}

export default AuthResolver;
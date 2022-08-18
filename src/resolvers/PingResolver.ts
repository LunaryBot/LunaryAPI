import { Arg, Authorized, Query, Resolver } from 'type-graphql';

@Resolver()
class PingResolver {

	@Authorized()
    @Query(() => String)
	async ping(@Arg('message') message: string) {
		return 'pong!';
	}
}

export default PingResolver;
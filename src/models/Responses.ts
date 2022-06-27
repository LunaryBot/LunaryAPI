import { Field, ID, ObjectType } from 'type-graphql';

import Guild, { Member } from './Guild';
import User from './User';

@ObjectType()
class GuildResponse {
    @Field(() => Guild)
    guild: Guild;

    @Field(() => Member)
    member: Member;

    @Field(() => User)
    user: User;
}

export { GuildResponse };
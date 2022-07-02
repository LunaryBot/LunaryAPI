import { Field, ID, ObjectType } from 'type-graphql';

import Guild from './Guild';
import Member from './Member';
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
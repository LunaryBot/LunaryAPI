import { Field, ID, ObjectType } from 'type-graphql';

import { IUser } from '../@types';

@ObjectType()
class User implements IUser {
    @Field(_type => ID)
    id: string;

    @Field()
    username: string;

    @Field()
    accent_color?: number;

    @Field()
    avatar: string;

    @Field()
    banner?: string;
    
    @Field()
    banner_color?: string;

    @Field()
    discriminator: string;

    @Field()
    email?: string;

    @Field()
    flags?: number;

    @Field()
    locale?: string;

    @Field()
    mfa_enabled?: boolean;

    @Field()
    public_flags: number;

    @Field()
    verified?: boolean;
}

export default User;
import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import { IMember } from '../@types';

const nullable = { nullable: true };

@ObjectType()
class Member implements IMember {
    @Field(_type => ID)
    	id: string;

    @Field(nullable)
    	nick: string;

    @Field(nullable)
    	communicationDisabledUntil: number;
    
    @Field()
    	createdAt: number;

    @Field(nullable)
    	premiumSince: number;

    @Field()
    	permissions: number;

    @Field(() => [String])
    	roles: Array<string>;
}

export default Member;
import { InputType, UseMiddleware, Field } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

const nullable = { nullable: true };

@InputType()
class UserProfileInput {
    @Field(type => String, nullable)
    	bio?: string;
    
        @Field(type => Number, nullable)
    	background?: number;

    @Field(type => Number, nullable)
    	layout?: number;
}

@InputType()
class UserDatabaseInput {
    @Field(type => [String], nullable)
    @UseMiddleware(DefaultValue<string[]>([]))
    	features: string[];

    @Field(type => UserProfileInput, nullable)
    	profile: UserProfileInput;
}
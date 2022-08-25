import { Field, ID, ObjectType } from 'type-graphql';

import { APIRole } from 'discord-api-types/v10';

const nullable = { nullable: true };

@ObjectType()
class Role implements APIRole {
    @Field(_type => ID)
    	id: string;
   
    @Field()
    	name: string;

    @Field()
    	color: number;

    @Field()
    	hoist: boolean;

    @Field(nullable)
    	icon: string | null;

    @Field()
    	managed: boolean;

    @Field()
    	mentionable: boolean;

    @Field(() => String)
    	permissions: string;

    @Field()
    	position: number;

    @Field(nullable)
    	unicodeEmoji?: string;
}

export default Role;
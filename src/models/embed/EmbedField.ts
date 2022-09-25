import { ObjectType, Field } from 'type-graphql';

const nullable = { nullable: true };

@ObjectType()
class EmbedField {
    @Field()
    	name: string;

    @Field()
    	value: string;

    @Field(type => Boolean, nullable)
    	inline?: boolean;
}

export { EmbedField };
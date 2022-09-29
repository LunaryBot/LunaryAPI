import { InputType, Field } from 'type-graphql';

const nullable = { nullable: true };

@InputType()
class EmbedFieldInput {
    @Field()
    	name: string;

    @Field()
    	value: string;

    @Field(type => Boolean, nullable)
    	inline?: boolean;
}

export { EmbedFieldInput };
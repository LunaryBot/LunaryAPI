import { Field } from 'type-graphql';

const nullable = { nullable: true };

class EmbedFieldBase {
    @Field()
    	name: string;

    @Field()
    	value: string;

    @Field(type => Boolean, nullable)
    	inline?: boolean;
}

export { EmbedFieldBase };
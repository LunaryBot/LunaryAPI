import { ObjectType, Field, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

const nullable = { nullable: true };

@ObjectType()
class EmbedField {
    @Field()
    	name: string;

    @Field()
    	value: string;

    @Field(type => Boolean, { ...nullable, defaultValue: false })
    @UseMiddleware(DefaultValue(false))
    	inline?: boolean;
}

export { EmbedField };
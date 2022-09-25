import { Field, ObjectType } from 'type-graphql';

const nullable = { nullable: true };

@ObjectType()
class EmbedImage {
    @Field()
    	url: string;

    @Field(type => String, nullable)
    	proxy_url?: string;

    @Field(type => Number, nullable)
    	height?: number;

    @Field(type => Number, nullable)
    	width?: number;
}

export { EmbedImage };
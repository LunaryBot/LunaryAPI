import { Field, InputType } from 'type-graphql';

const nullable = { nullable: true };

@InputType()
class EmbedImageInput {
    @Field()
    	url: string;

    @Field(type => String, nullable)
    	proxy_url?: string;

    @Field(type => Number, nullable)
    	height?: number;

    @Field(type => Number, nullable)
    	width?: number;
}

export { EmbedImageInput };
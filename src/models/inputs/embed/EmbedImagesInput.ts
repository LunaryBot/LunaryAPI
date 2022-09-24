import { InputType, Field } from 'type-graphql';

const nullable = { nullable: true };

class Base {
    @Field()
    	url: string;

    @Field(type => String, nullable)
    	proxy_url?: string;

    @Field(type => Number, nullable)
    	height?: number;

    @Field(type => Number, nullable)
    	width?: number;
}

@InputType()
class EmbedImageInput extends Base {}

@InputType()
class EmbedThumbnailInput extends Base {}

export { EmbedImageInput, EmbedThumbnailInput };
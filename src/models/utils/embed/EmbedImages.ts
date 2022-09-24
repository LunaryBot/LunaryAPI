import { Field } from 'type-graphql';

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

class EmbedImageBase extends Base {}

class EmbedThumbnailBase extends Base {}

export { EmbedImageBase, EmbedThumbnailBase };
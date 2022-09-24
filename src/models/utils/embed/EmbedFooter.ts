import { Field } from 'type-graphql';

const nullable = { nullable: true };

class EmbedFooterBase {
    @Field()
    	text: string;

    @Field(type => String, nullable)
    	icon_url?: string;

    @Field(type => String, nullable)
    	proxy_icon_url?: string;
}

export { EmbedFooterBase };
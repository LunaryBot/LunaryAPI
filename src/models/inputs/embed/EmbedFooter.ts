import { Field, InputType } from 'type-graphql';

const nullable = { nullable: true };

@InputType()
class EmbedFooterInput {
    @Field()
    	text: string;

    @Field(type => String, nullable)
    	icon_url?: string;

    @Field(type => String, nullable)
    	proxy_icon_url?: string;
}

export { EmbedFooterInput };
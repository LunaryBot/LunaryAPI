import { InputType, Field } from 'type-graphql';

const nullable = { nullable: true };

@InputType()
class EmbedAuthorInput {
    @Field()
    	name: string;

    @Field(type => String, nullable)
    	url?: string;

    @Field(type => String, nullable)
    	icon_url?: string;

    @Field(type => String, nullable)
    	proxy_icon_url?: string;
}

export { EmbedAuthorInput };
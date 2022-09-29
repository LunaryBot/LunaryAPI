import { Field, ObjectType } from 'type-graphql';

const nullable = { nullable: true };

@ObjectType()
class EmbedFooter {
    @Field()
    	text: string;

    @Field(type => String, nullable)
    	icon_url?: string;

    @Field(type => String, nullable)
    	proxy_icon_url?: string;
}

export { EmbedFooter };
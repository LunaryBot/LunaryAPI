import { EmbedType } from '@prisma/client';
import { Field, ObjectType } from 'type-graphql';

import { EmbedAuthor } from './EmbedAuthor';
import { EmbedField } from './EmbedField';
import { EmbedFooter } from './EmbedFooter';
import { EmbedImage } from './EmbedImage';

const nullable = { nullable: true };

@ObjectType()
class _Embed {
	@Field(type => String, nullable)
    	title?: string;

    @Field(type => String, nullable)
    	description?: string;

    @Field(type => String, nullable)
    	url?: string;

    @Field(type => Boolean, nullable)
    	timestamp?: boolean;

    @Field(type => Number, nullable)
    	color?: number;

	@Field(type => EmbedFooter, nullable)
    	footer?: EmbedFooter;

    @Field(type => EmbedImage, nullable)
    	image?: EmbedImage;

    @Field(type => EmbedImage, nullable)
    	thumbnail?: EmbedImage;

    @Field(type => EmbedAuthor, nullable)
    	author?: EmbedAuthor;

    @Field(type => [EmbedField], nullable)
    	fields?: EmbedField[];
}

@ObjectType()
class Embed {
	@Field()
		type: EmbedType;

	@Field()
		guild_id: string;

    @Field(type => String, nullable)
    	content?: string;

    @Field(type => [_Embed], nullable)
    	embeds?: _Embed[];
}

export { 
	Embed,
	EmbedAuthor,
	EmbedField,
	EmbedFooter,
	EmbedImage,
};
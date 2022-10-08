import { Field, InputType } from 'type-graphql';

import { EmbedAuthorInput } from './EmbedAuthor';
import { EmbedFieldInput } from './EmbedField';
import { EmbedFooterInput } from './EmbedFooter';
import { EmbedImageInput } from './EmbedImage';

const nullable = { nullable: true };

@InputType()
class _EmbedInput {
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

	@Field(type => EmbedFooterInput, nullable)
    	footer?: EmbedFooterInput;

    @Field(type => EmbedImageInput, nullable)
    	image?: EmbedImageInput;

    @Field(type => EmbedImageInput, nullable)
    	thumbnail?: EmbedImageInput;

    @Field(type => EmbedAuthorInput, nullable)
    	author?: EmbedAuthorInput;

    @Field(type => [EmbedFieldInput], nullable)
    	fields?: EmbedFieldInput[];
}

@InputType()
class EmbedInput {
    @Field(type => String, nullable)
    	content?: string;

	@Field(type => [_EmbedInput], nullable)
		embeds?: _EmbedInput[];
}

export { 
	EmbedInput,
	EmbedAuthorInput,
	EmbedFieldInput,
	EmbedFooterInput,
	EmbedImageInput,
};
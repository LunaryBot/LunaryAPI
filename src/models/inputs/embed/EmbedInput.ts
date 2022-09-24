import { ID, InputType, Field } from 'type-graphql';

import { EmbedAuthorInput } from './EmbedAuthorInput';
import { EmbedFieldInput } from './EmbedFieldInput';
import { EmbedFooterInput } from './EmbedFooterInput';
import { EmbedImageInput, EmbedThumbnailInput } from './EmbedImagesInput';

const nullable = { nullable: true };

@InputType()
class EmbedInput {
    @Field(type => String, nullable)
    	content?: string;

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

    @Field(type => EmbedThumbnailInput, nullable)
    	thumbnail?: EmbedThumbnailInput;

    @Field(type => EmbedAuthorInput, nullable)
    	author?: EmbedAuthorInput;

    @Field(type => [EmbedFieldInput], nullable)
    	fields?: EmbedFieldInput[];
}

export { EmbedInput };
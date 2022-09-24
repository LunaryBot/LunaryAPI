import { Field } from 'type-graphql';

import { EmbedAuthorBase } from './EmbedAuthor';
import { EmbedFieldBase } from './EmbedField';
import { EmbedFooterBase } from './EmbedFooter';
import { EmbedImageBase, EmbedThumbnailBase } from './EmbedImages';

const nullable = { nullable: true };

class EmbedBase {
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
}

export { 
	EmbedBase,
	EmbedAuthorBase,
	EmbedFieldBase,
	EmbedFooterBase,
	EmbedImageBase,
	EmbedThumbnailBase,
};
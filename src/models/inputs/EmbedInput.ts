import { EmbedType } from '@prisma/client';
import { InputType, Field } from 'type-graphql';

import { 
	EmbedAuthorBase, 
	EmbedBase, 
	EmbedFieldBase, 
	EmbedFooterBase, 
	EmbedImageBase, 
	EmbedThumbnailBase, 
} from '../utils/embed';

const nullable = { nullable: true };

@InputType()
class EmbedAuthorInput extends EmbedAuthorBase {}

@InputType()
class EmbedFieldInput extends EmbedFieldBase {}

@InputType()
class EmbedFooterInput extends EmbedFooterBase {}

@InputType()
class EmbedImageInput extends EmbedImageBase {}

@InputType()
class EmbedThumbnailInput extends EmbedThumbnailBase {}

@InputType()
class EmbedInput extends EmbedBase {
    @Field()
    	type: EmbedType;
    
    @Field()
    	guild_id: string;

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
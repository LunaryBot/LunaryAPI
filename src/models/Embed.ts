import { EmbedType } from '@prisma/client';
import { ObjectType, Field } from 'type-graphql';

import { 
	EmbedAuthorBase, 
	EmbedBase, 
	EmbedFieldBase, 
	EmbedFooterBase, 
	EmbedImageBase, 
	EmbedThumbnailBase, 
} from './utils/embed';

const nullable = { nullable: true };

@ObjectType()
class EmbedAuthor extends EmbedAuthorBase {}

@ObjectType()
class EmbedField extends EmbedFieldBase {}

@ObjectType()
class EmbedFooter extends EmbedFooterBase {}

@ObjectType()
class EmbedImage extends EmbedImageBase {}

@ObjectType()
class EmbedThumbnail extends EmbedThumbnailBase {}

@ObjectType()
class Embed extends EmbedBase {
    @Field()
    	type: EmbedType;
    
    @Field()
    	guild_id: string;
        
    @Field(type => EmbedFooter, nullable)
    	footer?: EmbedFooter;

    @Field(type => EmbedImage, nullable)
    	image?: EmbedImage;

    @Field(type => EmbedThumbnail, nullable)
    	thumbnail?: EmbedThumbnail;

    @Field(type => EmbedAuthor, nullable)
    	author?: EmbedAuthor;

    @Field(type => [EmbedField], nullable)
    	fields?: EmbedField[];
}

export { Embed };
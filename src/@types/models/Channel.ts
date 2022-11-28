import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import { APIGuildChannel, ChannelType } from 'discord-api-types/v10';

const nullable = { nullable: true };

@ObjectType()
class Channel implements APIGuildChannel<ChannelType.GuildText> {
    @Field(_type => ID)
    	id: string;
   
    @Field()
    	type: number;
   
    @Field()
    	name: string;
   
    @Field(nullable)
    	nsfw: boolean;
   
    @Field(nullable)
    	parent_id: string;
   
    @Field()
    	position: number;
}

export default Channel;
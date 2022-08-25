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
    	createdAt: number;
   
    @Field()
    	name: string;
   
    @Field()
    	nsfw: boolean;
   
    @Field()
    	parent_id: string;
   
    @Field()
    	position: number;
}

export default Channel;
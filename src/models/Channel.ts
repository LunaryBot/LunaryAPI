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
    	parentID: string;
   
    @Field()
    	position: number;
   
    @Field()
    	lastMessageID: string;
   
    @Field(nullable)
    	lastPinTimestamp: number;
   
    @Field()
    	rateLimitPerUser: number;
   
    @Field(nullable)
    	topic: string;

    @Field(nullable)
    	bitrate: number;

    @Field(nullable)
    	rtcRegion: string;

    @Field(nullable)
    	userLimit: number;
}

export default Channel;
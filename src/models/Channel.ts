import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import { IChannel } from '../@types';

const nullable = { nullable: true };

@ObjectType()
class Channel implements IChannel {
    @Field(_type => ID,)
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
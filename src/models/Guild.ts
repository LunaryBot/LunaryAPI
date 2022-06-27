import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import DefaultValue from '../utils/DefaultValue';

import { IChannel, IGuild, IMember, IRole } from '../@types';

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

@ObjectType()
class Guild implements IGuild {
    @Field(_type => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    icon: string;

    @Field({ defaultValue: false })
    @UseMiddleware(DefaultValue(false))
    access?: boolean;

    @Field(_type => [String])
    features: string[];

    @Field()
    owner: boolean;

    @Field()
    permissions: number;

    @Field()
    permissions_new: string;

    @Field(() => [Channel], { defaultValue: [] })
    @UseMiddleware(DefaultValue([]))
    channels?: Array<Channel>;

    @Field(() => [Role], { defaultValue: [] })
    @UseMiddleware(DefaultValue([]))
    roles?: Array<Role>;
}

@ObjectType()
class Member implements IMember {
    @Field(_type => ID)
    id: string;

    @Field(nullable)
    nick: string;

    @Field(nullable)
    communicationDisabledUntil: number;
    
    @Field()
    createdAt: number;

    @Field(nullable)
    premiumSince: number;

    @Field()
    permissions: number;

    @Field(() => [String])
    roles: Array<string>;
}

@ObjectType()
class RolePermissions {
    @Field()
    allow: string;

    @Field()
    deny: string;
}

@ObjectType()
class Role implements IRole {
    @Field(_type => ID,)
    id: string;

    @Field()
    createdAt: number;
   
    @Field()
    name: string;

    @Field()
    color: number;

    @Field()
    hoist: boolean;

    @Field(nullable)
    icon: string;

    @Field()
    managed: boolean;

    @Field()
    mentionable: boolean;

    @Field(() => RolePermissions)
    permissions: RolePermissions;

    @Field()
    position: number;

    @Field(nullable)
    unicodeEmoji: string;
}

export default Guild;

export { Channel, Member, Role }

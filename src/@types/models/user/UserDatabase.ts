import { User, UserPremiumType } from '@prisma/client';
import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

import { ShopItem } from '../Shop';
import { UserInventory } from './UserInventory';

const nullable = { nullable: true };

@ObjectType()
class UserProfile {
    @Field(type => String, nullable)
    	bio: string | null;

    @UseMiddleware(DefaultValue<number>(0))
    @Field(type => Number)
    	background: number;

    @UseMiddleware(DefaultValue<number>(0))
    @Field(type => Number)
    	layout: number;
}

@ObjectType()
class UserDatabase {
    @UseMiddleware(DefaultValue<string[]>([]))
    @Field(type => [String])
    	features: string[];

    @UseMiddleware(DefaultValue<number>(0))
    @Field(type => Number)
    	luas: number | null;

    @Field(type => Date, nullable)
    	last_daily_at: Date | null;

    @Field(type => UserProfile)
    	profile: UserProfile;

    @UseMiddleware(DefaultValue<number>(0))
    @Field(type => Number)
    	xp: number;

    @Field(type => [String])
    	flags: string[] | null;

    @UseMiddleware(DefaultValue<ShopItem[]>([]))
    @Field(type => [ShopItem])
    	inventory: ShopItem[];

    @Field(type => String, nullable)
    	premium_type: UserPremiumType | null;

    @Field(type => Date, nullable)
    	premium_until: Date | null;
}

export { UserDatabase };
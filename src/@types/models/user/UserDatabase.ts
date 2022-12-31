import { User, UserPremiumType } from '@prisma/client';
import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';

import DefaultValue from '@utils/DefaultValue';

import { UserInventory } from './UserInventory';

const nullable = { nullable: true };

@ObjectType()
class UserDatabase implements Omit<User, 'id' | 'features' | 'inventory' | 'inventory_using' | 'flags'> {
    @UseMiddleware(DefaultValue<string[]>([]))
    @Field(type => [String])
    	features: string[];

    @UseMiddleware(DefaultValue<number>(0))
    @Field(type => Number)
    	luas: number | null;

    @Field(type => Date, nullable)
    	last_daily_at: Date | null;

    @Field(type => String, nullable)
    	bio: string | null;

    @UseMiddleware(DefaultValue<number>(0))
    @Field(type => Number)
    	xp: number;

    @Field(type => [String])
    	flags: bigint | null;

    @Field(type => UserInventory)
    	inventory: UserInventory;

    @Field(type => String, nullable)
    	premium_type: UserPremiumType | null;

    @Field(type => Date, nullable)
    	premium_until: Date | null;
}

export { UserDatabase };
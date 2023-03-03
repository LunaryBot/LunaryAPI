import { Field, ObjectType } from 'type-graphql';

import { InventoryItem as _InventoryItem, InventoryItemRarity, InventoryItemType } from '@types';

import { ShopItem } from '../Shop';

@ObjectType()
class UserInventoryUsing {
    @Field(type => Number)
    	background: number;

    @Field(type => Number)
    	layout: number;
}

@ObjectType()
class UserInventory {
    @Field(type => [ShopItem])
    	owned: _InventoryItem[];

    @Field(type => UserInventoryUsing)
    	using: UserInventoryUsing;
}

export { UserInventory };
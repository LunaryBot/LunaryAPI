import { Field, ObjectType } from 'type-graphql';

import { InventoryItem as _InventoryItem, InventoryItemRarity, InventoryItemType } from '@types';

import { ShopItem } from '../Shop';

@ObjectType()
class UserInventory {
    @Field(type => [ShopItem])
    	owned: _InventoryItem[];

    @Field(type => [Number])
    	using: number[];
}

export { UserInventory };
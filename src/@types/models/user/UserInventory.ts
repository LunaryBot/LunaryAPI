import { Field, ObjectType } from 'type-graphql';

import { InventoryItem as _InventoryItem, InventoryItemRarity, InventoryItemType } from '@types';

@ObjectType()
class InventoryItemAssets {
    @Field()
    	link: string;
}

@ObjectType()
class UserInventory {
    @Field(type => [InventoryItem])
    	owned: _InventoryItem[];

    @Field(type => [Number])
    	using: number[];
}

@ObjectType()
class InventoryItem implements Omit<_InventoryItem, 'assets'> {
    @Field()
    	id: number;
    
    @Field()
    	name: string;

    @Field()
    	description: string;

    @Field()
    	price: number;

    @Field(type => String)
    	rarity: InventoryItemRarity;

    @Field(type => String)
    	type: InventoryItemType;

    @Field(type => InventoryItemAssets)
    	assets: InventoryItemAssets;
}

export { UserInventory, InventoryItem };
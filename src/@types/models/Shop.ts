import { Field, ObjectType } from 'type-graphql';

import { InventoryItem as _InventoryItem, InventoryItemRarity, InventoryItemType } from '@types';

@ObjectType()
class ItemAssets {
    @Field()
    	link: string;
}

@ObjectType()
class ShopItem implements Omit<_InventoryItem, 'assets'> {
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

    @Field(type => ItemAssets)
    	assets: ItemAssets;
}

export { ShopItem };
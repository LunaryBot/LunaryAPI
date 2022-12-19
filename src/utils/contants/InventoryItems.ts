import { InventoryItem } from '@types';

const id = (id: number) => {
	id = 1 << id;
	return id < 0 ? id * -1 : id;
};

export const InventoryItems: InventoryItem[] = [
	{
		id: id(0),
		type: 'BACKGROUND',
		name: 'Default',
		description: '',
		price: 0,
		rarity: 'COMMON',
		assets: {
			link: 'https://imgur.com/4V7z79E.png',
		},
	},
	{
		id: id(1),
		type: 'LAYOUT',
		name: 'Default',
		description: '',
		price: 0,
		rarity: 'COMMON',
	},
	{
		id: id(2),
		type: 'LAYOUT',
		name: 'Default White',
		description: '',
		price: 5000,
		rarity: 'EPIC',
	},
];
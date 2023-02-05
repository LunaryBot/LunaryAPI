import { ShopItem, ShopItemRarity } from '@prisma/client';
import Sydb, { ObjectReference } from 'sydb';

import { getRandom } from '../utils/getRandom';
import { setTimeToTrigger } from '../utils/setTimeToTrigger';

const dateString = (date: Date) => `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;

class ShopController {
	public readonly apollo: Apollo;
	public readonly config = Sydb({
		path: 'shopConfig.json',
		autoSave: true,
	});

	public _lastUpdated = this.config.ref('last_updated');
	public _dailyItems = this.config.ref('daily_items');
	
	public dailyItems: ShopItem[];

	constructor(apollo: Apollo) {
		Object.defineProperty(this, 'apollo', { 
			value: apollo, 
			enumerable: false, 
			writable: false, 
		});
	}
    
	get lastUpdated(): Date | null {
		const lastUpdated = this._lastUpdated.get();

		return lastUpdated ? new Date(lastUpdated as string) : null;
	}

	get dailyItemsIds(): bigint[] | null {
		const dailyItems = this._dailyItems.get() as number[];
		
		return dailyItems?.length ? dailyItems.map(item => BigInt(item)) : null;
	}

	set dailyItemsIds(value: bigint[] | null) {
		this._dailyItems.set(value?.length ? value.map(item => Number(item)) : null);
	}

	set lastUpdated(value: Date | null) {
		this._lastUpdated.set(value ? dateString(value) : null);
	}

	async getDailyItems(): Promise<ShopItem[]> {
		const items = await this.apollo.prisma.shopItem.findMany({
			where: {
				id: {
					in: (this.dailyItemsIds as (number|bigint)[]).map(id => Number(id)),
				},
			},
		});

		this.dailyItems = items;
		
		return items;
	}

	async update(starting: boolean = false) {
		const now = new Date();
		const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

		const { lastUpdated } = this;
		const lastUpdatedDate = new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate(), 0, 0, 0);
		const nextUpdateDate = new Date(lastUpdatedDate); nextUpdateDate.setDate(lastUpdatedDate.getDate() + 1);

		const isLateUpdate = !lastUpdated || starting && dateString(lastUpdated) !== dateString(lastUpdatedDate);

		let updated = false;

		if(!starting || isLateUpdate || !this.dailyItemsIds) {
			if(isLateUpdate && lastUpdated) {
				logger.warn(`Late Update, last update on ${dateString(lastUpdated)} not ${dateString(lastUpdatedDate)}`, { label: 'ShopController' });
			} else if(!this.dailyItemsIds) {
				logger.warn('Items from the last roll were not saved', { label: 'ShopController' });
			}

			this.lastUpdated = utc;

			await this.updateShopItems();

			updated = true;
		}
		
		if(!this.dailyItems?.length) await this.getDailyItems();

		setTimeToTrigger(this.update.bind(this), nextUpdateDate);

		console.log(nextUpdateDate.getTime() - utc.getTime());

		logger.info(`Shop ${updated ? 'Updated' : 'is Ok'}, next roll on ${nextUpdateDate.toString()}`, { label: 'ShopController' });
	}

	async updateShopItems() {
		const items = await this.apollo.prisma.shopItem.findMany({
			where: {
				rarity: {
					in: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'],
				},
				type: {
					in: ['BACKGROUND', 'LAYOUT'],
				},
				enabled: true,
			},
		});

		const chances = {
			common: chancesCalc('COMMON'),
			uncommon: chancesCalc('UNCOMMON'),
			rare: chancesCalc('RARE'),
			epic: chancesCalc('EPIC'),
			legendary: chancesCalc('LEGENDARY'),
		};

		console.log(chances);

		const dailyItems = getRandom(items.map(item => ({
			...item, 
			chance: chances[item.rarity.toLowerCase() as keyof typeof chances],
		})), 2) as ShopItem[];
		
		const ids = dailyItems.map(item => BigInt(item.id));

		this.dailyItemsIds = ids;
		this.dailyItems = dailyItems;

		await this.apollo.prisma.shopItem.updateMany({
			where: {
				id: {
					in: ids.map(id => Number(id)),
				},
			},
			data: {
				last_appearance: new Date(),
			},
		});

		function chancesCalc(rarity: ShopItemRarity) {
			const filtered = items.filter(item => item.rarity == rarity);

			return ((filtered.length * 100) / items.length) / filtered.length;
		}
	}
}

export default ShopController;
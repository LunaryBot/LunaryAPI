import { ShopItem, ShopItemRarity } from '@prisma/client';
import ontime, { ontime as _ontime } from 'ontime';
import Sydb, { ObjectReference } from 'sydb';

import { getRandom } from '../utils/getRandom';
import { setTimeToTrigger } from '../utils/setTimeToTrigger';

const interval = 1 * 1000 * 60 * 60 * 24;

const updateTime = [13, 22, 0] as const; // h, m, s

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

		return lastUpdated ? new Date(lastUpdated as number) : null;
	}

	get dailyItemsIds(): bigint[] | null {
		const dailyItems = this._dailyItems.get() as number[];
		
		return dailyItems?.length ? dailyItems.map(item => BigInt(item)) : null;
	}

	set dailyItemsIds(value: bigint[] | null) {
		this._dailyItems.set(value?.length ? value.map(item => Number(item)) : null);
	}

	set lastUpdated(value: Date | null) {
		this._lastUpdated.set(value?.toISOString() || null);
	}

	async _getDailyItems(): Promise<ShopItem[]> {
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

	setTimeToTrigger(triggerIn: Date) {
		const now = new Date();

		console.log(now);

		const time = triggerIn.getTime() - now.getTime();
	
		console.log(time);

		if(time > 0) {
			setTimeout(() => {
				this.update();
			}, triggerIn.getTime() - now.getTime());
		}
	};

	async init() {
		const { lastUpdated } = this;

		const lastUpdatedDate = new Date();
		lastUpdatedDate.setUTCHours(...updateTime, 0);

		const nextUpdateDate = new Date(lastUpdatedDate.getTime() + interval);
		nextUpdateDate.setUTCHours(...updateTime, 0);

		const isLateUpdate = !lastUpdated || nextUpdateDate.getTime() - lastUpdated.getTime() !== interval;

		let updated = false;

		if(isLateUpdate || !this.dailyItemsIds) {
			if(isLateUpdate && lastUpdated) {
				logger.warn(`Late Update, last update on ${lastUpdated.toString()} not ${lastUpdatedDate.toString()}`, { label: 'ShopController' });
			} else if(!this.dailyItemsIds) {
				logger.warn('Items from the last roll were not saved', { label: 'ShopController' });
			}

			this.update();

			updated = true;
		} else {
			logger.info(`Shop is Ok, next roll on ${nextUpdateDate.toString()}`, { label: 'ShopController' });
		}

		if(!this.dailyItems?.length) await this._getDailyItems();

		(ontime as any as typeof _ontime)({
			utc: true,
			cycle: [updateTime.map(x => `${x < 10 ? '0' : ''}${x}`).join(':')],
		}, () => {
			this.update();
		});
	}

	async update() {
		const updatedDate = new Date();
		updatedDate.setUTCHours(...updateTime, 0);

		const nextUpdateDate = new Date(updatedDate.getTime() + interval);
		nextUpdateDate.setUTCHours(...updateTime, 0);

		await this.updateShopItems();

		this.lastUpdated = updatedDate;

		logger.info(`Shop Updated, next roll on ${nextUpdateDate.toString()}`, { label: 'ShopController' });
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
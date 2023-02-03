import Sydb, { ObjectReference } from 'sydb';

import { setTimeToTrigger } from '../utils/setTimeToTrigger';

const dateString = (date: Date) => `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;

class ShopController {
	public readonly apollo: Apollo;
	public readonly config = Sydb({
		path: 'shopConfig.json',
		autoSave: true,
	});

	public _lastUpdated = this.config.ref('last_updated');

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

	set lastUpdated(value: Date|null) {
		this._lastUpdated.set(value ? dateString(value) : null);
	}

	update(starting: boolean = false) {
		const now = new Date();
		const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

		const { lastUpdated } = this;
		const lastUpdatedDate = new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate(), 0, 0, 0);
		const nextUpdateDate = new Date(lastUpdatedDate); nextUpdateDate.setDate(lastUpdatedDate.getDate() + 1);

		const isLateUpdate = !lastUpdated || starting && dateString(lastUpdated) !== dateString(lastUpdatedDate);

		if(!starting || isLateUpdate) {
			if(isLateUpdate && lastUpdated) {
				logger.warn(`Late Update, last update on ${dateString(lastUpdated)} not ${dateString(lastUpdatedDate)}`, { label: 'ShopController' });
			}

			this.lastUpdated = utc;
			this.updateShopItems();
		}

		setTimeToTrigger(this.update.bind(this), nextUpdateDate);

		logger.info(`Shop Updated, next update on ${nextUpdateDate.toString()}`, { label: 'ShopController' });
		console.log(nextUpdateDate.getTime() - utc.getTime());
	}

	updateShopItems() {
		console.log('Updated shop!');
	}
}

export default ShopController;
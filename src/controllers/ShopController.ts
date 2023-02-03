import Sydb, { ObjectReference } from 'sydb';

import { setTimeToTrigger } from '../utils/setTimeToTrigger';

const dateString = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

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
		const { lastUpdated } = this;
		const lastUpdatedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const nextUpdateDate = new Date(lastUpdatedDate); nextUpdateDate.setDate(lastUpdatedDate.getDate() + 1);

		const isLateUpdate = !lastUpdated || starting && dateString(lastUpdated) !== dateString(lastUpdatedDate);

		if(!starting || isLateUpdate) {
			if(isLateUpdate && lastUpdated) {
				logger.warn(`Late Update, last update on ${dateString(lastUpdated)} not ${dateString(lastUpdatedDate)}`, { label: 'ShopController' });
			}

			this.lastUpdated = now;
			this.updateShopItems();
		}

		setTimeToTrigger(this.update.bind(this), nextUpdateDate);

		logger.info(`Shop Updated, next update on ${nextUpdateDate.toISOString()}`, { label: 'ShopController' });
	}

	updateShopItems() {
		console.log('Updated shop!');
	}
}

export default ShopController;
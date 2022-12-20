import BitField from '@utils/BitField';
import { InventoryItems } from '@utils/contants/InventoryItems';

class UserInventory extends BitField {
	public static Flags = Object.fromEntries(InventoryItems.map(item => ([`${item.type.toLowerCase()}${item.name.firstCharInUpperCase()}`, BigInt(item.id)])));

	toItemsArray() {
		return InventoryItems.filter(item => this.has(BigInt(item.id)));
	}

	get ids() {
		return this.toItemsArray().map(({ id }) => id);
	}
}

export { UserInventory };
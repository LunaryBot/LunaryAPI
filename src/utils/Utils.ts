const az = [ ...'abcdefghijklmnopqrstuvwxyz' ];

class Utils {
	public static formatHumanPunishmentId(punishmentsCount: number): string {
		const a = (punishmentsCount + 1) % 1000000;

		const id = az[Math.floor((punishmentsCount + 1) / 1000000)].toUpperCase() + '0'.repeat(6 - a.toString().length) + a;
        
		return id;
	}

	public static formatDatabasePunishmentId(punishmentId: string) {
		punishmentId = punishmentId.replace(/^#/, '');

		const letter = punishmentId.charAt(0);

		const number = punishmentId.substring(1);

		return Number(`${az.indexOf(letter.toLowerCase())}${number}`);
	}

	public static isPremium(premiumUntil?: Date | null) {
		return premiumUntil && premiumUntil.getTime() >= Date.now();
	}
}

export { Utils };
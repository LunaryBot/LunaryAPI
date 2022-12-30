import { GraphQLResolveInfo, FieldNode } from 'graphql';

const az = [ ...'abcdefghijklmnopqrstuvwxyz' ];

type WhereBoolean = Record<string, WhereType | Where>;

type WhereType = boolean | { [name: string]: boolean | WhereBoolean };

type Where = Record<string, boolean | WhereType>;

class Utils {
	public static graphqlSchemaToPrismaWhere(info: GraphQLResolveInfo, queryName: string) {
		const selection = info.operation.selectionSet.selections.find(selection => (selection as FieldNode).name.value == queryName) as FieldNode;

		const selections = selection.selectionSet?.selections as FieldNode[] || [];

		console.log(this.#formatSelections(selections));
	}

	static #formatSelections(selections: FieldNode[]): Where {
		return Object.fromEntries(
			selections.map(selection => {
				const subSelections = selection.selectionSet?.selections as FieldNode[] || [];

				return [selection.name.value, !subSelections.length ? true : this.#formatSelections(subSelections)];
			})
		);
	}

	public static formatHumanPunishmentId(punishmentsCount: number): string {
		const a = (punishmentsCount) % 1000000;

		const id = az[Math.floor((punishmentsCount) / 1000000)].toUpperCase() + '0'.repeat(6 - a.toString().length) + a;
        
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
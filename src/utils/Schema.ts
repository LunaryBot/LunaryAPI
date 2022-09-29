export type SchemaO = { [x: string | number]: SchemaType };
export type SchemaTypeBase = SchemaO | StringConstructor | NumberConstructor| BooleanConstructor | SchemaTypeBase[] | Schema | null;
export type SchemaType = SchemaTypeBase | SchemaOption;
export type SchemaOption = { _type: SchemaTypeBase, default?: any, nullable?: boolean, middleware?: (value: any) => any };

class Schema {
	constructor(protected _schema?: SchemaO) {}

	test(target?: any) {
		return this._test(target, this._schema);
	}

	parse(target?: any): SchemaType {
		return this._parse(target, this._schema);
	}

	private _test(target?: any, schema?: SchemaType) {
		if(target == undefined) return false;
		switch (this._type(schema)) {
			case String:
				if(typeof target != 'string') return false;
				break;
			case Number:
				if(typeof target != 'number') return false;
				break;
			case Array:
				if(!(target instanceof Array)) return false;
				for(const key of target) {
					if(typeof key == 'string') {
						if((schema as SchemaType[]).indexOf(String) < 0) return false;
					}
					if(typeof key == 'number') {
						if((schema as SchemaType[]).indexOf(Number) < 0) return false;
					}
					if(typeof key == 'object') {
						if((schema as SchemaType[]).findIndex(val => {
							if(this._test(key, val)) return true;
						}) < 0) return false;
					}
				}
				break;
			case Schema:
				if(!(schema as Schema).test(target)) return false;
				break;
			case Object:
				if(typeof target != 'object') return false;
				for(const key of Object.keys(schema as SchemaO)) {
					if(!(key in target)) return false;
					if(!this._test(target[key], (schema as SchemaO)[key])) return false;
				}
				break;
		}
		return true;
	}

	private _parse(target?: any, schema?: SchemaType) {
		let parsed: any;
		switch (this._type(schema)) {
			case String:
				if(typeof target == 'string') parsed = target;
				break;
			case Number:
				if(typeof target == 'number') parsed = target;
				break;
			case Boolean:
				if(typeof target == 'boolean') parsed = target;
				break;
			case Array:
				parsed = [];
				if(target instanceof Array) {
					for(const key of target) {
						if(typeof key == 'string') {
							if((schema as SchemaType[]).indexOf(String) >= 0) parsed.push(key);
						}
						if(typeof key == 'number') {
							if((schema as SchemaType[]).indexOf(Number) >= 0) parsed.push(key);
						}
						if(typeof key == 'object') {
							let found = false;
							let _schema: SchemaType;
							for(const idx in schema as SchemaType[]) {
								if((schema as SchemaType[])[idx] instanceof Schema) {
									_schema = ((schema as SchemaType[])[idx] as Schema)._schema as SchemaType;
								} else {
									_schema = (schema as SchemaType[])[idx];
								}
								for(const val of Object.keys(_schema as object)) {
									if(val in key) {
										found = true;
										if((schema as SchemaType[])[idx] instanceof Schema) {
											(parsed as any[]).push(((schema as SchemaType[])[idx] as Schema).parse(key));
										} else {
											(parsed as any[]).push(this._parse(key, _schema));
										}
										break;
									}
								}

								if(found) break;
							}
						}
					}
				}
				break;
			case Schema:
				parsed = (schema as Schema).parse(target);
				break;
			case Object:
				parsed = {};
				for(const key of Object.keys(schema as SchemaO)) {
					const targetParsed = this._parse(target?.[key], (schema as SchemaO)[key]);
                    
					if(targetParsed === undefined) {
						if(((schema as SchemaO)[key] as SchemaOption).nullable !== true) parsed[key] = targetParsed;
					} else {
						parsed[key] = targetParsed;
					}
				}
				break;

			default: {
				if(schema !== undefined) {
					target = (schema as SchemaOption).middleware?.(target) ?? target;

					let targetParsed = this._parse(target, (schema as SchemaOption)._type);
					
					if(targetParsed === undefined && (schema as SchemaOption).default !== undefined) {
						targetParsed = (schema as SchemaOption).default;
					}

					parsed = targetParsed;
				}

				break;
			}
		}

		return parsed;
	}

	private _type(schema?: SchemaType) {
		if(schema == String) return String;
		if(schema == Number) return Number;
		if(schema == Boolean) return Boolean;
		if(schema instanceof Array) return Array;
		if(schema instanceof Schema) return Schema;
		if(typeof schema == 'object' && !schema?._type) return Object;
	}
}

export default Schema;
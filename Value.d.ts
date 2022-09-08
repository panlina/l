declare class Value {
	constructor(type: string);
	type: string;
}

export = Value;

declare namespace Value {
	export class Undefined extends Value {
		constructor();
	}

	export class Null extends Value {
		constructor();
	}

	export class Boolean extends Value {
		constructor(value: boolean);
		value: boolean;
	}

	export class Number extends Value {
		constructor(value: number);
		value: number;
	}

	export class String extends Value {
		constructor(value: string);
		value: string;
	}
}

declare namespace Value {
	export function equals(left: Value, right: Value): boolean;
}

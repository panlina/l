import Expression = require("./Expression");
import Environment = require("./Environment");

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

	export class Array extends Value {
		constructor(element: Value);
		element: Value[];
	}

	export class Tuple extends Value {
		constructor(element: Value);
		element: Value[];
	}

	export class Object extends Value {
		constructor(property: { [key: string]: Value });
		property: { [key: string]: Value };
	}

	export class Function extends Value {
		constructor(expression: Expression.Function, environment: Environment<Value>);
		expression: Expression.Function;
		environment: Environment<Value>;
	}
}

declare namespace Value {
	export function equals(left: Value, right: Value): boolean;
	export function truthy(value: Value): boolean;
}

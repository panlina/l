class Expression {
	constructor(type: string);
	type: string;
}

export = Expression;

export class Literal extends Expression {
	constructor(value);
	value;
}

export class Name extends Expression {
	constructor(identifier: string);
	identifier: string;
}

export class Object extends Expression {
	constructor(property: { name: string, value: Expression }[]);
	property: { name: string, value: Expression }[];
}

export class Array extends Expression {
	constructor(element: Expression[]);
	element: Expression[];
}

export class Tuple extends Expression {
	constructor(element: Expression[]);
	element: Expression[];
}

export class Property extends Expression {
	constructor(expression: Expression, property: string);
	expression: Expression;
	property: string;
}

export class Element extends Expression {
	constructor(expression: Expression, index: Expression);
	expression: Expression;
	index: Expression;
}

export class Call extends Expression {
	constructor(expression: Expression, argument: Expression);
	expression: Expression;
	argument: Expression;
}

export class Placeholder extends Expression {
	constructor(name: string);
	name: string;
}

declare class Expression {
	constructor(type: string);
	type: string;
}

export = Expression;

export class Undefined extends Expression {
	constructor();
}

export class Null extends Expression {
	constructor();
}

export class Boolean extends Expression {
	constructor(value: boolean);
	value: boolean;
}

export class Number extends Expression {
	constructor(value: number);
	value: number;
}

export class String extends Expression {
	constructor(value: string);
	value: string;
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

export class Operation extends Expression {
	constructor(operator: string, left: Expression, right: Expression);
	operator: string;
	left: Expression;
	right: Expression;
}

export class Conditional extends Expression {
	constructor(condition: Expression, _true: Expression, _false: Expression);
	condition: Expression;
	true: Expression;
	false: Expression;
}

export class Statement extends Expression {
	constructor(statement: (Statement | string)[]);
	statement: (Statement | string)[];
}

export class Function extends Expression {
	constructor(argument: Expression.Name, expression: Expression);
	argument: Expression.Name;
	expression: Expression;
}

export class Placeholder extends Expression {
	constructor(name: string);
	name: string;
}

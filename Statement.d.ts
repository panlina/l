import * as Expression from './Expression';

declare class Statement {
	constructor(type: string);
	type: string;
}

export = Statement;

export class Assign extends Statement {
	constructor(left: Expression, right: Expression);
	left: Expression;
	right: Expression;
}

export class Var extends Statement {
	constructor(identifier: string);
	identifier: string;
}

export class Block extends Statement {
	constructor(statement: (Statement | string)[]);
	statement: (Statement | string)[];
}

export class Goto extends Statement {
	constructor(label: string);
	label: string;
}

export class Expression extends Statement {
	constructor(expression: Expression);
	expression: Expression;
}

export class Placeholder extends Expression {
	constructor(name: string);
	name: string;
}

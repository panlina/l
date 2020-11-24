import * as Expression from './Expression';

class Statement {
	constructor(type: string);
	type: string;
}

export = Statement;

export class Assign extends Statement {
	constructor(left: Expression, right: Expression);
	left: Expression;
	right: Expression;
}

export class Expression extends Statement {
	constructor(expression: Expression);
	expression: Expression;
}

export class Placeholder extends Expression {
	constructor(name: string);
	name: string;
}

import * as Expression from './Expression';

class Statement {
	constructor(type: string);
	type: string;
}

export = Statement;

export class Assign extends Statement {
	constructor(left: string, right: Expression);
	left: string;
	right: Expression;
}

export class Placeholder extends Expression {
	constructor(name: string);
	name: string;
}

import Expression = require('./Expression');

declare class Statement {
	constructor(type: string);
	type: string;
}

export = Statement;

declare namespace Statement {
	export class Assign extends Statement {
		constructor(left: Expression, right: Expression);
		left: Expression;
		right: Expression;
	}

	export class Var extends Statement {
		constructor(name: Expression.Name);
		name: Expression.Name;
	}

	export type Label = string;

	export class Block extends Statement {
		constructor(statement: (Statement | Label)[]);
		statement: (Statement | Label)[];
	}

	export class Goto extends Statement {
		constructor(label: Label);
		label: Label;
	}

	export class Expression extends Statement {
		constructor(expression: Expression);
		expression: Expression;
	}

	export class While extends Statement {
		constructor(condition: Expression, statement: Statement);
		condition: Expression;
		statement: Statement;
	}

	export class Break extends Statement {
		constructor();
	}

	export class Placeholder extends Expression {
		constructor(name: string);
		name: string;
	}

	export function isLabel(statement: Statement | Label): statement is Label;
}

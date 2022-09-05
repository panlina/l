import l = require('.');
import Label = require('./Label');

declare class Statement {
	constructor(type: string);
	type: string;
}

export = Statement;

declare namespace Statement {
	export class Var extends Statement {
		constructor(name: l.Expression.Name);
		name: l.Expression.Name;
	}

	export class Assign extends Statement {
		constructor(left: l.Expression, right: l.Expression);
		left: l.Expression;
		right: l.Expression;
	}

	export class Block extends Statement {
		constructor(statement: (Statement | Label)[]);
		statement: (Statement | Label)[];
	}

	export class Goto extends Statement {
		constructor(label: l.Expression.Name);
		label: l.Expression.Name;
	}

	export class Expression extends Statement {
		constructor(expression: l.Expression);
		expression: l.Expression;
	}

	export class While extends Statement {
		constructor(condition: l.Expression, statement: Statement);
		condition: l.Expression;
		statement: Statement;
	}

	export class Break extends Statement {
		constructor();
	}

	export class Placeholder extends Statement {
		constructor(name: string);
		name: string;
	}
}

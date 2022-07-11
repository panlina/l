class Statement {
	constructor(type) {
		this.type = type;
	}
}

class Assign extends Statement {
	constructor(left, right) {
		super('assign');
		this.left = left;
		this.right = right;
	}
}

class Var extends Statement {
	constructor(name) {
		super('var');
		this.name = name;
	}
}

class Block extends Statement {
	constructor(statement) {
		super('block');
		this.statement = statement;
	}
}

class Goto extends Statement {
	constructor(label) {
		super('goto');
		this.label = label;
	}
}

class Expression extends Statement {
	constructor(expression) {
		super('expression');
		this.expression = expression;
	}
}

class While extends Statement {
	constructor(condition, statement) {
		super('while');
		this.condition = condition;
		this.statement = statement;
	}
}

class Break extends Statement {
	constructor() {
		super('break');
	}
}

class Placeholder extends Statement {
	constructor(name) {
		super('placeholder');
		this.name = name;
	}
}

function isLabel(statement) {
	return typeof statement == 'string';
}

module.exports = Statement;
module.exports.Assign = Assign;
module.exports.Var = Var;
module.exports.Block = Block;
module.exports.Goto = Goto;
module.exports.Expression = Expression;
module.exports.While = While;
module.exports.Break = Break;
module.exports.Placeholder = Placeholder;
module.exports.isLabel = isLabel;

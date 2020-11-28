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

class Block extends Statement {
	constructor(statement) {
		super('block');
		this.statement = statement;
	}
}

class Var extends Statement {
	constructor(identifier) {
		super('var');
		this.identifier = identifier;
	}
}

class Expression extends Statement {
	constructor(expression) {
		super('expression');
		this.expression = expression;
	}
}

class Placeholder extends Statement {
	constructor(name) {
		super('placeholder');
		this.name = name;
	}
}

module.exports = Statement;
module.exports.Assign = Assign;
module.exports.Block = Block;
module.exports.Var = Var;
module.exports.Expression = Expression;
module.exports.Placeholder = Placeholder;

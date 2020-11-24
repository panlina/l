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
module.exports.Expression = Expression;
module.exports.Placeholder = Placeholder;

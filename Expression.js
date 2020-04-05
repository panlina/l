class Expression {
	constructor(type) {
		this.type = type;
	}
}

class Literal extends Expression {
	constructor(value) {
		super('literal');
		this.value = value;
	}
}

class Name extends Expression {
	constructor(identifier) {
		super('name');
		this.identifier = identifier;
	}
}

class Call extends Expression {
	constructor(expression, argument) {
		super('call');
		this.expression = expression;
		this.argument = argument;
	}
}

module.exports = Expression;
module.exports.Literal = Literal;
module.exports.Name = Name;
module.exports.Call = Call;

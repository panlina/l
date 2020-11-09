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

class Object extends Expression {
	constructor(property) {
		super('object');
		this.property = property;
	}
}

class Array extends Expression {
	constructor(element) {
		super('array');
		this.element = element;
	}
}

class Tuple extends Expression {
	constructor(element) {
		super('tuple');
		this.element = element;
	}
}

class Call extends Expression {
	constructor(expression, argument) {
		super('call');
		this.expression = expression;
		this.argument = argument;
	}
}

class Placeholder extends Expression {
	constructor(name) {
		super('placeholder');
		this.name = name;
	}
}

module.exports = Expression;
module.exports.Literal = Literal;
module.exports.Name = Name;
module.exports.Object = Object;
module.exports.Array = Array;
module.exports.Tuple = Tuple;
module.exports.Call = Call;
module.exports.Placeholder = Placeholder;

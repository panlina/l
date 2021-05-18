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

class Null extends Expression {
	constructor() {
		super('null');
	}
}

class Boolean extends Expression {
	constructor(value) {
		super('boolean');
		this.value = value;
	}
}

class Number extends Expression {
	constructor(value) {
		super('number');
		this.value = value;
	}
}

class String extends Expression {
	constructor(value) {
		super('string');
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

class Property extends Expression {
	constructor(expression, property) {
		super('property');
		this.expression = expression;
		this.property = property;
	}
}

class Element extends Expression {
	constructor(expression, index) {
		super('element');
		this.expression = expression;
		this.index = index;
	}
}

class Call extends Expression {
	constructor(expression, argument) {
		super('call');
		this.expression = expression;
		this.argument = argument;
	}
}

class Operation extends Expression {
	constructor(operator, left, right) {
		super('operation');
		this.operator = operator;
		this.left = left;
		this.right = right;
	}
}

class Conditional extends Expression {
	constructor(condition, _true, _false) {
		super('conditional');
		this.condition = condition;
		this.true = _true;
		this.false = _false;
	}
}

class Statement extends Expression {
	constructor(statement) {
		super('statement');
		this.statement = statement;
	}
}

class Function extends Expression {
	constructor(argument, expression) {
		super('function');
		this.argument = argument;
		this.expression = expression;
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
module.exports.Null = Null;
module.exports.Boolean = Boolean;
module.exports.Number = Number;
module.exports.String = String;
module.exports.Name = Name;
module.exports.Object = Object;
module.exports.Array = Array;
module.exports.Tuple = Tuple;
module.exports.Property = Property;
module.exports.Element = Element;
module.exports.Call = Call;
module.exports.Operation = Operation;
module.exports.Conditional = Conditional;
module.exports.Statement = Statement;
module.exports.Function = Function;
module.exports.Placeholder = Placeholder;

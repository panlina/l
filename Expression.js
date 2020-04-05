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

module.exports = Expression;
module.exports.Literal = Literal;
module.exports.Name = Name;

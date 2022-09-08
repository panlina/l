class Value {
	constructor(type) {
		this.type = type;
	}
}

class Undefined extends Value {
	constructor() {
		super('undefined');
	}
}

class Null extends Value {
	constructor() {
		super('null');
	}
}

class Boolean extends Value {
	constructor(value) {
		super('boolean');
		this.value = value;
	}
}

class Number extends Value {
	constructor(value) {
		super('number');
		this.value = value;
	}
}

class String extends Value {
	constructor(value) {
		super('string');
		this.value = value;
	}
}

function equals(left, right) {
	if (left.type != right.type) return false;
	switch (left.type) {
		case 'undefined':
		case 'null':
			return true;
		case 'boolean':
		case 'number':
		case 'string':
			return left.value == right.value;
	}
}

module.exports = Value;
module.exports.Undefined = Undefined;
module.exports.Null = Null;
module.exports.Boolean = Boolean;
module.exports.Number = Number;
module.exports.String = String;
module.exports.equals = equals;

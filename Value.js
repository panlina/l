var util = require('util');

class Value {
	constructor(type) {
		this.type = type;
	}
}

class Undefined extends Value {
	constructor() {
		super('undefined');
	}
	[util.inspect.custom]() { return undefined; }
}

class Null extends Value {
	constructor() {
		super('null');
	}
	[util.inspect.custom]() { return null; }
}

class Boolean extends Value {
	constructor(value) {
		super('boolean');
		this.value = value;
	}
	[util.inspect.custom]() { return this.value; }
}

class Number extends Value {
	constructor(value) {
		super('number');
		this.value = value;
	}
	[util.inspect.custom]() { return this.value; }
}

class String extends Value {
	constructor(value) {
		super('string');
		this.value = value;
	}
	[util.inspect.custom](depth, inspectOptions, inspect) {
		return inspectOptions.stylize(JSON.stringify(this.value), 'string');
	}
}

class Array extends Value {
	constructor(element) {
		super('array');
		this.element = element;
	}
	[util.inspect.custom]() { return this.element; }
}

class Tuple extends Value {
	constructor(element) {
		super('tuple');
		this.element = element;
	}
	[util.inspect.custom](depth, inspectOptions, inspect) {
		return `{${inspect(this.element, inspectOptions).slice(1, -1)}}`;
	}
}

class Object extends Value {
	constructor(property) {
		super('object');
		this.property = property;
	}
	[util.inspect.custom]() { return this.property; }
}

class Function extends Value {
	constructor(expression, environment) {
		super('function');
		this.expression = expression;
		this.environment = environment;
	}
	[util.inspect.custom](depth, inspectOptions, inspect) {
		return inspectOptions.stylize("[function]", 'special');
	}
}

class NativeFunction extends Value {
	constructor(value) {
		super('function');
		this.value = value;
	}
	[util.inspect.custom](depth, inspectOptions, inspect) {
		return inspectOptions.stylize("[native function]", 'special');
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

function truthy(value) {
	switch (value.type) {
		case 'undefined':
		case 'null':
			return false;
		case 'boolean':
		case 'number':
		case 'string':
			return value.value;
	}
}

module.exports = Value;
module.exports.Undefined = Undefined;
module.exports.Null = Null;
module.exports.Boolean = Boolean;
module.exports.Number = Number;
module.exports.String = String;
module.exports.Array = Array;
module.exports.Tuple = Tuple;
module.exports.Object = Object;
module.exports.Function = Function;
module.exports.NativeFunction = NativeFunction;
module.exports.equals = equals;
module.exports.truthy = truthy;

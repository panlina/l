var Value = require('./Value');
var RuntimeError = require('./RuntimeError');
class Machine {
	constructor(environment, program) {
		this.environment = environment;
		this.program = program;
		this.position = 0;
	}
	step() {
		if (this.program instanceof Array)
			if (this.position < this.program.length)
				this.execute(this.program[this.position++]);
	}
	execute(statement) {
		switch (statement.type) {
			case 'assign':
				var resolution = this.environment.resolve(statement.left.identifier);
				if (!resolution) throw new RuntimeError.UndefinedName(statement.left);
				var [, scope] = resolution;
				scope.name[statement.left.identifier] = this.evaluate(statement.right);
				break;
		}
	}
	evaluate(expression) {
		switch (expression.type) {
			case 'undefined':
			case 'null':
			case 'boolean':
			case 'number':
			case 'string':
				return expression;
			case 'name':
				var resolution = this.environment.resolve(expression.identifier);
				if (!resolution) throw new RuntimeError.UndefinedName(expression);
				var [value] = resolution;
				return value;
			case 'array':
			case 'tuple':
				return new Value.Array(expression.element.map(e => this.evaluate(e)));
			case 'object':
				var $property = {};
				for (var property of expression.property)
					$property[property.name] = this.evaluate(property.value);
				return new Value.Object($property);
			case 'property':
				return this.evaluate(expression.expression).property[expression.property];
			case 'element':
				return this.evaluate(expression.expression).element[this.evaluate(expression.index).value];
			case 'operation':
				return operate(expression.operator, expression.left ? this.evaluate(expression.left) : undefined, expression.right ? this.evaluate(expression.right) : undefined);
		}
	}
}
function operate(operator, left, right) {
	switch (operator) {
		case '*':
			return new Value.Number(left.value * right.value);
		case '/':
			return new Value.Number(left.value / right.value);
		case '+':
			return left != undefined ?
				left.type == 'number' ?
					new Value.Number(left.value + right.value) :
					new Value.String(left.value + right.value) :
				new Value.Number(right.value);
		case '-':
			return left != undefined ?
				new Value.Number(left.value - right.value) :
				new Value.Number(-right.value);
		case '<=':
			return new Value.Boolean(left.value <= right.value);
		case '=':
			return new Value.Boolean(left.value == right.value);
		case '>=':
			return new Value.Boolean(left.value >= right.value);
		case '<':
			return new Value.Boolean(left.value < right.value);
		case '!=':
			return new Value.Boolean(left.value != right.value);
		case '>':
			return new Value.Boolean(left.value > right.value);
		case '!':
			return new Value.Boolean(!right.value);
		case '&':
			return new Value.Boolean(left.value && right.value);
		case '|':
			return new Value.Boolean(left.value || right.value);
	}
}
module.exports = Machine;

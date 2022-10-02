var Scope = require('./Scope');
var Label = require('./Label');
var Value = require('./Value');
var Error = require('./Error');
var extractFunctionArgumentNames = require('./extractFunctionArgumentNames');
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
				this.assign(statement.left, this.evaluate(statement.right));
				break;
			case 'block':
				var name = statement.statement
					.filter(statement =>
						statement.type == 'var'
					);
				var name = name.reduce(
					(name, v) => (
						name[v.name.identifier] = new Value.Undefined(),
						name
					), {}
				);
				var statement = statement.statement.filter(
					statement => !(statement instanceof Label || statement.type == 'var')
				);
				this.environment = this.environment.push(new Scope(name));
				for (var statement of statement)
					this.execute(statement);
				this.environment = this.environment.parent;
				break;
			case 'expression':
				this.evaluate(statement.expression);
				break;
		}
	}
	assign(expression, value) {
		switch (expression.type) {
			case 'name':
				var resolution = this.environment.resolve(expression.identifier);
				if (!resolution) throw new Error.UndefinedName(expression);
				var [, scope] = resolution;
				scope.name[expression.identifier] = value;
				break;
			case 'element':
				this.evaluate(expression.expression).element[this.evaluate(expression.index).value] = value;
				break;
			case 'property':
				this.evaluate(expression.expression).property[expression.property] = value;
				break;
			case 'array':
			case 'tuple':
				for (var i in expression.element)
					this.assign(expression.element[i], value.element[i]);
				break;
			case 'object':
				for (var p of expression.property)
					this.assign(p.value, value.property[p.name]);
				break;
			default:
				throw new Error.InvalidAssignee(expression);
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
				if (!resolution) throw new Error.UndefinedName(expression);
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
				var $expression = this.evaluate(expression.expression);
				if ($expression.type != 'array' && $expression.type != 'tuple') throw new Error.ArrayOrTupleExpected(expression.expression);
				var $index = this.evaluate(expression.index);
				return $expression.element[$index.value];
			case 'call':
				var $expression = this.evaluate(expression.expression);
				if ($expression.type != 'function') throw new Error.FunctionExpected(expression.expression);
				var $argument = this.evaluate(expression.argument);
				var environment = this.environment;
				this.environment = $expression.environment.push(new Scope({}));
				for (var name of extractFunctionArgumentNames($expression.expression.argument))
					this.environment.scope.name[name.identifier] = new Value.Undefined();
				this.environment.scope.name['return'] = new Value.Undefined();
				this.assign($expression.expression.argument, $argument);
				var $return = this.evaluate($expression.expression.expression);
				this.environment = environment;
				return $return;
			case 'operation':
				return operate(expression.operator, expression.left ? this.evaluate(expression.left) : undefined, expression.right ? this.evaluate(expression.right) : undefined);
			case 'conditional':
				return Value.truthy(this.evaluate(expression.condition)) ?
					this.evaluate(expression.true) :
					this.evaluate(expression.false);
			case 'statement':
				var name = expression.statement
					.filter(statement =>
						statement.type == 'var'
					);
				var name = name.reduce(
					(name, v) => (
						name[v.name.identifier] = new Value.Undefined(),
						name
					), {}
				);
				name['return'] = new Value.Undefined();
				var statement = expression.statement.filter(
					statement => !(statement instanceof Label || statement.type == 'var')
				);
				this.environment = this.environment.push(new Scope(name));
				for (var statement of statement)
					this.execute(statement);
				var $return = this.environment.scope.name['return'];
				this.environment = this.environment.parent;
				return $return;
			case 'function':
				for (var name of extractFunctionArgumentNames(expression.argument))
					if (name instanceof Error.InvalidFunctionParameter) throw name;
				return new Value.Function(expression, this.environment);
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

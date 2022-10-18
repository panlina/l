var Scope = require('./Scope');
var Expression = require('./Expression');
var Statement = require('./Statement');
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
				this.evaluateStatements(statement.statement, new Expression.Undefined());
				break;
			case 'goto':
				throw statement.label.identifier;
				break;
			case 'expression':
				this.evaluate(statement.expression);
				break;
			case 'while':
				while (Value.truthy(this.evaluate(statement.condition)))
					this.execute(statement.statement);
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
				var $expression = this.evaluate(expression.expression);
				if ($expression.type != 'array' && $expression.type != 'tuple') throw new Error.ArrayOrTupleExpected(expression.expression);
				var $index = this.evaluate(expression.index);
				if ($index.type != 'number') throw new Error.NumberExpected(expression.index);
				if ($index.value >= $expression.element.length) throw new Error.ArrayOrTupleIndexOutOfBound(expression.index);
				$expression.element[$index.value] = value;
				break;
			case 'property':
				var $expression = this.evaluate(expression.expression);
				if ($expression.type != 'object') throw new Error.ObjectExpected(expression.expression);
				$expression.property[expression.property] = value;
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
	evaluate(program) {
		if (program instanceof Expression) {
			var expression = program;
			switch (expression.type) {
				case 'undefined':
					return new Value.Undefined();
				case 'null':
					return new Value.Null();
				case 'boolean':
					return new Value.Boolean(expression.value);
				case 'number':
					return new Value.Number(expression.value);
				case 'string':
					return new Value.String(expression.value);
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
					var $expression = this.evaluate(expression.expression);
					if ($expression.type != 'object') throw new Error.ObjectExpected(expression.expression);
					return $expression.property[expression.property];
				case 'element':
					var $expression = this.evaluate(expression.expression);
					if ($expression.type != 'array' && $expression.type != 'tuple') throw new Error.ArrayOrTupleExpected(expression.expression);
					var $index = this.evaluate(expression.index);
					if ($index.type != 'number') throw new Error.NumberExpected(expression.index);
					if ($index.value >= $expression.element.length) throw new Error.ArrayOrTupleIndexOutOfBound(expression.index);
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
					var $left = expression.left ? this.evaluate(expression.left) : undefined;
					var $right = expression.right ? this.evaluate(expression.right) : undefined;
					try {
						return operate(expression.operator, $left, $right);
					} catch (e) {
						if (e == 'left') throw new Error.WrongOperandType(expression.left);
						if (e == 'right') throw new Error.WrongOperandType(expression.right);
					}
				case 'conditional':
					return Value.truthy(this.evaluate(expression.condition)) ?
						this.evaluate(expression.true) :
						this.evaluate(expression.false);
				case 'statement':
					return this.evaluateStatements(
						[new Statement.Var(new Expression.Name('return')), ...expression.statement],
						new Expression.Name('return')
					);
				case 'function':
					for (var name of extractFunctionArgumentNames(expression.argument))
						if (name instanceof Error.InvalidFunctionParameter) throw name;
					return new Value.Function(expression, this.environment);
			}
		}
		if (program instanceof Array)
			return this.evaluateStatements(
				[new Statement.Var(new Expression.Name('return')), ...program],
				new Expression.Name('return')
			);
	}
	evaluateStatements(statement, expression) {
		var labelDictionary = {};
		var variable = {};
		for (var i = 0, j = 0; i < statement.length; i++) {
			var s = statement[i];
			if (s instanceof Label)
				labelDictionary[s.name.identifier] = j;
			else if (s.type == 'var')
				variable[s.name.identifier] = undefined;
			else
				j++;
		}
		var statement = statement.filter(
			statement => !(statement instanceof Label || statement.type == 'var')
		);
		variable['return'] = new Value.Undefined();
		this.environment = this.environment.push(new Scope(variable));
		for (var i = 0; i < statement.length;) {
			var s = statement[i];
			let l;
			try { this.execute(s); }
			catch (label) {
				if (label in labelDictionary)
					l = label;
				else
					throw label;
			}
			if (l != undefined)
				i = labelDictionary[l];
			else
				i++;
		}
		var $return = this.evaluate(expression);
		this.environment = this.environment.parent;
		return $return;
	}
}
function operate(operator, left, right) {
	switch (operator) {
		case '*':
			if (left.type != 'number') throw 'left';
			if (right.type != 'number') throw 'right';
			return new Value.Number(left.value * right.value);
		case '/':
			if (left.type != 'number') throw 'left';
			if (right.type != 'number') throw 'right';
			return new Value.Number(left.value / right.value);
		case '+':
			if (left != undefined) {
				if (left.type == 'number' && right.type == 'number')
					return new Value.Number(left.value + right.value);
				if (left.type == 'string' && right.type == 'string')
					return new Value.String(left.value + right.value);
				if (left.type == 'number' || left.type == 'string')
					throw 'right';
				else
					throw 'left';
			} else {
				if (right.type != 'number') throw 'right';
				return new Value.Number(right.value);
			}
		case '-':
			if (left != undefined) {
				if (left.type == 'number' && right.type == 'number')
					return new Value.Number(left.value - right.value);
				if (left.type == 'number')
					throw 'right';
				else
					throw 'left';
			} else {
				if (right.type != 'number') throw 'right';
				return new Value.Number(-right.value);
			}
		case '<=':
			if (
				left.type == 'number' && right.type == 'number'
				||
				left.type == 'string' && right.type == 'string'
			)
				return new Value.Boolean(left.value <= right.value);
			if (left.type == 'number' || left.type == 'string')
				throw 'right';
			else
				throw 'left';
		case '=':
			if (left.type != 'undefined' && left.type != 'null' && left.type != 'boolean' && left.type != 'number' && left.type != 'string')
				throw 'left';
			if (right.type != 'undefined' && right.type != 'null' && right.type != 'boolean' && right.type != 'number' && right.type != 'string')
				throw 'right';
			if (left.type != right.type)
				throw 'right';
			return new Value.Boolean(left.value == right.value);
		case '>=':
			if (
				left.type == 'number' && right.type == 'number'
				||
				left.type == 'string' && right.type == 'string'
			)
				return new Value.Boolean(left.value >= right.value);
			if (left.type == 'number' || left.type == 'string')
				throw 'right';
			else
				throw 'left';
		case '<':
			if (
				left.type == 'number' && right.type == 'number'
				||
				left.type == 'string' && right.type == 'string'
			)
				return new Value.Boolean(left.value < right.value);
			if (left.type == 'number' || left.type == 'string')
				throw 'right';
			else
				throw 'left';
		case '!=':
			if (left.type != 'undefined' && left.type != 'null' && left.type != 'boolean' && left.type != 'number' && left.type != 'string')
				throw 'left';
			if (right.type != 'undefined' && right.type != 'null' && right.type != 'boolean' && right.type != 'number' && right.type != 'string')
				throw 'right';
			if (left.type != right.type)
				throw 'right';
			return new Value.Boolean(left.value != right.value);
		case '>':
			if (
				left.type == 'number' && right.type == 'number'
				||
				left.type == 'string' && right.type == 'string'
			)
				return new Value.Boolean(left.value > right.value);
			if (left.type == 'number' || left.type == 'string')
				throw 'right';
			else
				throw 'left';
		case '!':
			return new Value.Boolean(!right.value);
		case '&':
			return new Value.Boolean(left.value && right.value);
		case '|':
			return new Value.Boolean(left.value || right.value);
	}
}
module.exports = Machine;

var Scope = require('./Scope');
var Expression = require('./Expression');
var Statement = require('./Statement');
var Label = require('./Label');
var Value = require('./Value');
var Error = require('./Error');
var extractFunctionArgumentNames = require('./extractFunctionArgumentNames');
class Machine {
	constructor(environment) {
		this.return;
		this.callStack = [{ environment: environment }];
		this.generator;
	}
	get environment() { return this.callStack[0].environment; }
	set environment(value) { this.callStack[0].environment = value; }
	get current() { return this.callStack[0].current; }
	set current(value) { this.callStack[0].current = value; }
	step() {
		for (; ;) {
			var { value: value, done: done } = this.generator.next();
			if (done)
				this.return = value;
			else {
				this.current = value;
				if (!value.node) continue;
			}
			break;
		}
		return done;
	}
	run(program) {
		this.callStack = [{ environment: this.environment }];
		this.generator = this._run(program);
	}
	*_run(program) {
		if (program instanceof Expression) {
			var expression = program;
			switch (expression.type) {
				case 'undefined':
					yield expression;
					return new Value.Undefined();
				case 'null':
					yield expression;
					return new Value.Null();
				case 'boolean':
					yield expression;
					return new Value.Boolean(expression.value);
				case 'number':
					yield expression;
					return new Value.Number(expression.value);
				case 'string':
					yield expression;
					return new Value.String(expression.value);
				case 'name':
					yield expression;
					var resolution = this.environment.resolve(expression.identifier);
					if (!resolution) throw new Error.UndefinedName(expression);
					var [value] = resolution;
					return value;
				case 'array':
					var $element = [];
					for (var e of expression.element)
						$element.push(yield* this._run(e));
					yield expression;
					return new Value.Array($element);
				case 'tuple':
					var $element = [];
					for (var e of expression.element)
						$element.push(yield* this._run(e));
					yield expression;
					return new Value.Tuple($element);
				case 'object':
					var $property = {};
					for (var property of expression.property)
						$property[property.name] = yield* this._run(property.value);
					yield expression;
					return new Value.Object($property);
				case 'property':
					var $expression = yield* this._run(expression.expression);
					if ($expression.type != 'object') throw new Error.ObjectExpected(expression.expression);
					yield expression;
					return $expression.property[expression.property];
				case 'element':
					var $expression = yield* this._run(expression.expression);
					if ($expression.type != 'array' && $expression.type != 'tuple') throw new Error.ArrayOrTupleExpected(expression.expression);
					var $index = yield* this._run(expression.index);
					if ($index.type != 'number') throw new Error.NumberExpected(expression.index);
					if ($index.value >= $expression.element.length) throw new Error.ArrayOrTupleIndexOutOfBound(expression.index);
					yield expression;
					return $expression.element[$index.value];
				case 'call':
					var $expression = yield* this._run(expression.expression);
					if ($expression.type != 'function') throw new Error.FunctionExpected(expression.expression);
					var $argument = yield* this._run(expression.argument);
					yield expression;
					this.callStack.unshift({ current: expression, environment: this.environment });
					var environment = this.environment;
					this.environment = $expression.environment.push(new Scope({}));
					for (var name of extractFunctionArgumentNames($expression.expression.argument))
						this.environment.scope.name[name.identifier] = new Value.Undefined();
					this.environment.scope.name['return'] = new Value.Undefined();
					this.assign($expression.expression.argument, $argument);
					var $return = yield* this._run($expression.expression.expression);
					this.environment = environment;
					this.callStack.shift();
					return $return;
				case 'operation':
					var $left = expression.left ? yield* this._run(expression.left) : undefined;
					var $right = expression.right ? yield* this._run(expression.right) : undefined;
					yield expression;
					try {
						return operate(expression.operator, $left, $right);
					} catch (e) {
						if (e == 'left') throw new Error.WrongOperandType(expression.left);
						if (e == 'right') throw new Error.WrongOperandType(expression.right);
					}
				case 'conditional':
					return Value.truthy(yield* this._run(expression.condition)) ?
						yield* this._run(expression.true) :
						yield* this._run(expression.false);
				case 'statement':
					return yield* this.runStatements(
						[new Statement.Var(new Expression.Name('return')), ...expression.statement],
						new Expression.Name('return')
					);
				case 'function':
					for (var name of extractFunctionArgumentNames(expression.argument))
						if (name instanceof Error.InvalidFunctionParameter) throw name;
					yield expression;
					return new Value.Function(expression, this.environment);
			}
		}
		if (program instanceof Array)
			return yield* this.runStatements(
				[new Statement.Var(new Expression.Name('return')), ...program],
				new Expression.Name('return')
			);
		if (program instanceof Statement) {
			var statement = program;
			switch (statement.type) {
				case 'assign':
					var $right = yield* this._run(statement.right);
					yield statement;
					this.assign(statement.left, $right);
					break;
				case 'block':
					yield* this.runStatements(statement.statement, new Expression.Undefined());
					break;
				case 'goto':
					yield statement;
					throw statement.label.identifier;
					break;
				case 'expression':
					yield* this._run(statement.expression);
					break;
				case 'while':
					while (Value.truthy(yield* this._run(statement.condition)))
						try { yield* this._run(statement.statement); }
						catch (e) {
							if (e == '.break')
								break;
							else
								throw e;
						}
					break;
				case 'break':
					yield statement;
					throw '.break';
					break;
			}
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
	*runStatements(statement, expression) {
		var labelDictionary = {};
		var variable = {};
		for (var i = 0, j = 0; i < statement.length; i++) {
			var s = statement[i];
			if (s instanceof Label)
				labelDictionary[s.name.identifier] = j;
			else if (s.type == 'var')
				variable[s.name.identifier] = new Value.Undefined();
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
			try { yield* this._run(s); }
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
		var $return = yield* this._run(expression);
		this.environment = this.environment.parent;
		return $return;
	}
	execute(statement) {
		this.callStack = [{ environment: this.environment }];
		var generator = this._run(statement);
		while (!generator.next().done);
	}
	evaluate(expression) {
		this.callStack = [{ environment: this.environment }];
		var generator = this._run(expression);
		var next;
		while (!(next = generator.next()).done);
		return next.value;
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

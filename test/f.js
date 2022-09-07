var Scope = require("../Scope");
var Label = require("../Label");
var i = {
	expression: {
		undefined: expression => () => undefined,
		null: expression => () => null,
		boolean: expression => () => expression.value,
		number: expression => () => expression.value,
		string: expression => () => expression.value,
		name: expression => {
			return environment => {
				var [value, scope] = environment.resolve(expression.identifier);
				return value;
			};
		},
		object: $property =>
			environment => $property.reduce(
				(o, p) => Object.assign(
					o,
					{ [p.name]: p.value(environment) }
				),
				{}
			),
		array: $element =>
			environment => $element.map(
				e => e(environment)
			),
		tuple: $element =>
			environment => $element.map(
				e => e(environment)
			),
		property: ($expression, $property) =>
			environment => $expression(environment)[$property],
		element: ($expression, $index) =>
			environment => $expression(environment)[$index(environment)],
		call: ($expression, $argument) =>
			environment => $expression(environment)($argument(environment)),
		operation: ($operator, $left, $right) =>
			environment => operate(
				$operator,
				$left && $left(environment),
				$right && $right(environment)
			),
		conditional: ($condition, $true, $false) =>
			environment => $condition(environment) ?
				$true(environment) :
				$false(environment)
	},
	statement: {
		'[]': ($statement, $expression) => {
			var labelDictionary = {};
			var variable = {};
			for (var i = 0, j = 0; i < $statement.length; i++) {
				var statement = $statement[i];
				if (statement instanceof Label)
					labelDictionary[statement.name.identifier] = j;
				else if (statement.type == 'var')
					variable[statement.name.identifier] = undefined;
				else
					j++;
			}
			$statement = $statement.filter(statement => typeof statement == 'function');
			variable['return'] = undefined;
			return environment => {
				environment = environment.push(new Scope(variable));
				for (var i = 0; i < $statement.length;) {
					var statement = $statement[i];
					let l;
					try { statement(environment); }
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
				return $expression(environment);
			};
		},
		goto: label =>
			environment => {
				throw label.identifier;
			}
	},
	assign: {
		name: ($left, $right) => {
			return environment => {
				var [, scope] = environment.resolve($left.identifier);
				scope.name[$left.identifier] = $right(environment);
			};
		},
		element: ($left, $right) =>
			environment => {
				$left.expression(environment)[$left.index(environment)] = $right(environment);
			},
		property: ($left, $right) =>
			environment => {
				$left.expression(environment)[$left.property] = $right(environment);
			}
	},
	abstract: f => environment => argument => f(environment.push(new Scope({ argument: argument })))
};
function operate(operator, left, right) {
	switch (operator) {
		case '*':
			return left * right;
		case '/':
			return left / right;
		case '+':
			return left != undefined ? left + right : right;
		case '-':
			return left != undefined ? left - right : -right;
		case '<=':
			return left <= right;
		case '=':
			return left == right;
		case '>=':
			return left >= right;
		case '<':
			return left < right;
		case '!=':
			return left != right;
		case '>':
			return left > right;
		case '!':
			return !right;
		case '&':
			return left && right;
		case '|':
			return left || right;
	}
}
module.exports = i;

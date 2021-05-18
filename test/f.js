var Scope = require("../Scope");
var i = {
	expression: {
		literal: expression => () => expression.value,
		null: expression => () => expression.value,
		boolean: expression => () => expression.value,
		number: expression => () => expression.value,
		string: expression => () => expression.value,
		name: (expression, resolution) => {
			var [, depth] = resolution;
			return environment => {
				var scope = environment.ancestor(depth).scope;
				return scope.resolve(expression.identifier);
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
				$false(environment),
		function: ($argument, $expression) =>
			environment =>
				argument => $expression(
					environment.push(
						new Scope({ [$argument]: argument })
					)
				)
	},
	statement: {
		'[]': $statement => {
			var labelDictionary = {};
			for (var i = 0, j = 0; i < $statement.length; i++) {
				var statement = $statement[i];
				if (typeof statement == 'string')
					labelDictionary[statement] = j;
				else
					j++;
			}
			$statement = $statement.filter(statement => typeof statement == 'function');
			return environment => {
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
			};
		},
		goto: label =>
			environment => {
				throw label;
			}
	},
	assign: {
		name: ($left, $right) => {
			var [, depth] = $left.resolution;
			return environment => {
				var scope = environment.ancestor(depth).scope;
				scope[$left.identifier] = $right(environment);
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
	concat: ($effect, $return) => environment => {
		$effect(environment);
		return $return(environment);
	},
	pushScope: f => environment => f(environment.push(new Scope({})))
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

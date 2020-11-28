var Scope = require("../Scope");
var i = {
	expression: {
		literal: expression => () => expression.value,
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
		statement: $statement => environment => { $statement(environment); }
	},
	statement: {
		'[]': $statement =>
			environment => { $statement.forEach(statement => statement(environment)); },
		assign: ($left, $right) => {
			switch ($left.type) {
				case 'name':
					var [, depth] = $left.resolution;
					return environment => {
						var scope = environment.ancestor(depth).scope;
						scope[$left.identifier] = $right(environment);
					};
				case 'element':
					return environment => {
						$left.expression(environment)[$left.index(environment)] = $right(environment);
					};
				case 'property':
					return environment => {
						$left.expression(environment)[$left.property] = $right(environment);
					};
			}
		},
		block: $statement => environment => {
			var e = environment.push(new Scope({}));
			$statement.forEach(statement => statement(e));
		},
		expression: $expression => environment => { $expression(environment); }
	}
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

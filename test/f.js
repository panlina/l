var i = {
	expression: {
		literal: expression => () => expression.value,
		name: expression => environment => environment[expression.identifier],
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
			environment => $expression(environment)($argument(environment))
	},
	statement: {
		'[]': $statement =>
			environment => { $statement.forEach(statement => statement(environment)); },
		assign: ($left, $right) =>
			environment => { environment[$left] = $right(environment); }
	}
};
module.exports = i;

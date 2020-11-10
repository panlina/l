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
		call: ($expression, $argument) =>
			environment => $expression(environment)($argument(environment))
	},
	statement: {
		'[]': (statement, compile) => (
			$statement => environment => { $statement.forEach(statement => statement(environment)); }
		)(
			statement.map(statement => compile(statement, i))
		),
		assign: (statement, compile) => (
			($left, $right) => environment => { environment[$left] = $right(environment); }
		)(
			statement.left.identifier,
			compile(statement.right, i)
		)
	}
};
module.exports = i;

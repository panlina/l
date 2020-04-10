var i = {
	expression: {
		literal: expression => () => expression.value,
		name: expression => environment => environment[expression.identifier],
		call: (expression, compile) => (
			($expression, $argument) => environment => $expression(environment)($argument(environment))
		)(
			compile(expression.expression, i),
			compile(expression.argument, i)
		)
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

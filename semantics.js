var grammar = require('./grammar');
var Expression = require('./Expression');
var Statement = require('./Statement');
var semantics = grammar.createSemantics().addOperation('parse', {
	number: x => new Expression.Literal(+x.sourceString),
	identifier: (_, x) => x.sourceString,
	ExpressionName: identifier => new Expression.Name(identifier.parse()),
	ExpressionAtom_parentheses: (open, expression, close) => expression.parse(),
	ExpressionCall_call: (expression, argument) => new Expression.Call(expression.parse(), argument.parse()),
	StatementAssign: (left, equal, right, semicolon) => new Statement.Assign(left.parse(), right.parse())
});
module.exports = semantics;

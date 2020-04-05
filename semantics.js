var grammar = require('./grammar');
var Expression = require('./Expression');
var semantics = grammar.createSemantics().addOperation('parse', {
	number: x => new Expression.Literal(+x.sourceString),
	identifier: (_, x) => x.sourceString,
	ExpressionName: identifier => new Expression.Name(identifier.parse()),
	ExpressionAtom_parentheses: (open, expression, close) => expression.parse(),
	ExpressionCall_call: (expression, argument) => new Expression.Call(expression.parse(), argument.parse())
});
module.exports = semantics;

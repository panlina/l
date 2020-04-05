var grammar = require('./grammar');
var Expression = require('./Expression');
var semantics = grammar.createSemantics().addOperation('parse', {
	number: x => new Expression.Literal(+x.sourceString),
	identifier: (_, x) => x.sourceString,
	ExpressionName: identifier => new Expression.Name(identifier.parse())
});
module.exports = semantics;

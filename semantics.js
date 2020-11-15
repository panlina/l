var grammar = require('./grammar');
var Expression = require('./Expression');
var Statement = require('./Statement');
var semantics = grammar.createSemantics().addOperation('parse', {
	number: x => new Expression.Literal(+x.sourceString),
	string: (open, x, close) => new Expression.Literal(x.children.map(char => char.parse()).join('')),
	char_literal: x => x.sourceString,
	char_escaped: (backslash, x) => escape[x.sourceString],
	identifier: (_, x) => x.sourceString,
	ExpressionName: identifier => new Expression.Name(identifier.parse()),
	ExpressionObjectProperty: (name, colon, value) => ({ name: name.parse(), value: value.parse() }),
	ExpressionObject: (open, property, close) => new Expression.Object(property.asIteration().parse()),
	ExpressionArray: (open, element, close) => new Expression.Array(element.asIteration().parse()),
	ExpressionTuple: (open, element, close) => new Expression.Tuple(element.asIteration().parse()),
	ExpressionAtom_parentheses: (open, expression, close) => expression.parse(),
	ExpressionAtom_placeholder: (open, name, close) => new Expression.Placeholder(name.parse()),
	ExpressionMember_property: (expression, dot, property) => new Expression.Property(expression.parse(), property.parse()),
	ExpressionMember_element: (expression, at, index) => new Expression.Element(expression.parse(), index.parse()),
	ExpressionCall_call: (expression, argument) => new Expression.Call(expression.parse(), argument.parse()),
	ExpressionAdd_add: binary,
	ExpressionMultiply_multiply: binary,
	ExpressionAddUnary_add: unary,
	ExpressionConditional_conditional: (condition, question, _true, colon, _false) => new Expression.Conditional(
		condition.parse(),
		_true.parse(),
		_false.parse()
	),
	StatementAssign: (left, equal, right, semicolon) => new Statement.Assign(left.parse(), right.parse()),
	Statement_placeholder: (open, name, close) => new Statement.Placeholder(name.parse()),
	Program_expression: (expression, end) => expression.parse(),
	Program_statement: (statement, end) => statement.children.map(s => s.parse())
});
function binary(left, operator, right) {
	return new Expression.Operation(
		operator.sourceString,
		left.parse(),
		right.parse()
	);
}
function unary(operator, operand) {
	if (operator.isTerminal())
		return new Expression.Operation(
			operator.sourceString,
			undefined,
			operand.parse()
		);
	else {
		[operator, operand] = [operand, operator];
		return new Expression.Operation(
			operator.sourceString,
			operand.parse(),
			undefined
		);
	}
}
var escape = {
	'"': '"',
	'\\': '\\',
	b: '\b',
	f: '\f',
	n: '\n',
	r: '\r',
	t: '\t',
	v: '\v'
};
module.exports = semantics;

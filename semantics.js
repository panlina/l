var grammar = require('./grammar');
var Expression = require('./Expression');
var Statement = require('./Statement');
var semantics = grammar.createSemantics().addOperation('parse', {
	undefined: _undefined => new Expression.Undefined(),
	null: _null => new Expression.Null(),
	false: _false => new Expression.Boolean(false),
	true: _true => new Expression.Boolean(true),
	number: x => new Expression.Number(+x.sourceString),
	string: (open, x, close) => new Expression.String(x.children.map(char => char.parse()).join('')),
	char_literal: x => x.sourceString,
	char_escaped: (backslash, x) => escape[x.sourceString],
	identifier: (_, x) => x.sourceString,
	ExpressionName: identifier => new Expression.Name(identifier.parse()),
	ExpressionObjectProperty: (name, colon, value) => ({ name: name.parse(), value: value.parse() }),
	ExpressionObject: (open, property, close) => new Expression.Object(property.asIteration().parse()),
	ExpressionArray: (open, element, close) => new Expression.Array(element.asIteration().parse()),
	ExpressionTuple: (open, element, close) => new Expression.Tuple(element.asIteration().parse()),
	ExpressionAtom_parentheses: (open, expression, close) => expression.parse(),
	ExpressionAtom_statement: (open, statement, close) => new Expression.Statement(statement.parse()),
	ExpressionAtom_placeholder: (open, name, close) => new Expression.Placeholder(name.parse()),
	ExpressionMember_property: (expression, dot, property) => new Expression.Property(expression.parse(), property.parse()),
	ExpressionMember_element: (expression, at, index) => new Expression.Element(expression.parse(), index.parse()),
	ExpressionCall_call: (expression, argument) => new Expression.Call(expression.parse(), argument.parse()),
	ExpressionAdd_add: binary,
	ExpressionMultiply_multiply: binary,
	ExpressionAddUnary_add: unary,
	ExpressionRelation_relation: binary,
	ExpressionNot_not: unary,
	ExpressionAnd_and: binary,
	ExpressionOr_or: binary,
	ExpressionConditional_conditional: (condition, question, _true, colon, _false) => new Expression.Conditional(
		condition.parse(),
		_true.parse(),
		_false.parse()
	),
	ExpressionFunction_function: (argument, arrow, expression) => new Expression.Function(argument.parse(), expression.parse()),
	ExpressionLabeled_labeled: (label, expression) => Object.create(expression.parse(), { label: { value: label.parse() } }),
	Statements: statement => statement.children.map(s => s.parse()),
	Label: (identifier, colon) => identifier.parse(),
	StatementAssign: (let, equation, semicolon) => new Statement.Assign(equation.parse().left, equation.parse().right),
	StatementVar: (_var, identifier, semicolon) => new Statement.Var(identifier.parse()),
	StatementBlock: (open, statement, close) => new Statement.Block(statement.parse()),
	StatementGoto: (goto, label, semicolon) => new Statement.Goto(label.parse()),
	StatementExpression: (expression, semicolon) => new Statement.Expression(expression.parse()),
	StatementWhile: (_while, condition, _do, statement) => new Statement.While(condition.parse(), statement.parse()),
	StatementBreak: (_break, semicolon) => new Statement.Break(),
	Statement_placeholder: (open, name, close) => new Statement.Placeholder(name.parse()),
	Program_expression: (expression, end) => expression.parse(),
	Program_statement: (statement, end) => statement.parse()
});
var isSyntax = {
	undefined: true,
	null: true,
	false: true,
	true: true,
	number: true,
	string: true,
	char_literal: false,
	char_escaped: false,
	identifier: false,
	ExpressionName: true,
	ExpressionObjectProperty: false,
	ExpressionObject: true,
	ExpressionArray: true,
	ExpressionTuple: true,
	ExpressionAtom_parentheses: false,
	ExpressionAtom_statement: true,
	ExpressionAtom_placeholder: true,
	ExpressionMember_property: true,
	ExpressionMember_element: true,
	ExpressionCall_call: true,
	ExpressionAdd_add: true,
	ExpressionMultiply_multiply: true,
	ExpressionAddUnary_add: true,
	ExpressionRelation_relation: true,
	ExpressionNot_not: true,
	ExpressionAnd_and: true,
	ExpressionOr_or: true,
	ExpressionConditional_conditional: true,
	ExpressionFunction_function: true,
	ExpressionLabeled_labeled: false,
	Statements: false,
	Label: false,
	StatementAssign: true,
	StatementVar: true,
	StatementBlock: true,
	StatementGoto: true,
	StatementExpression: true,
	StatementWhile: true,
	StatementBreak: true,
	Statement_placeholder: true,
	Program_expression: false,
	Program_statement: false
};
var actionDict = semantics._getSemantics().operations.parse.actionDict;
for (var name in actionDict)
	if (isSyntax[name])
		actionDict[name].$isSyntax = true;
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

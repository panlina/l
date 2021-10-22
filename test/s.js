var t = require("@babel/types");
var i = {
	expression: {
		undefined: expression => t.unaryExpression("void", t.numericLiteral(0)),
		null: expression => t.nullLiteral(),
		boolean: expression => t.booleanLiteral(expression.value),
		number: expression => t.numericLiteral(expression.value),
		string: expression => t.stringLiteral(expression.value),
		name: expression => t.identifier(expression.identifier),
		object: $property =>
			t.objectExpression(
				$property.map(
					p => t.objectProperty(
						t.stringLiteral(p.name),
						p.value
					)
				)
			),
		array: $element => t.arrayExpression($element),
		tuple: $element => t.arrayExpression($element),
		property: ($expression, $property) =>
			t.memberExpression($expression, t.identifier($property)),
		element: ($expression, $index) =>
			t.memberExpression($expression, $index, true),
		call: ($expression, $argument) =>
			t.callExpression($expression, [$argument]),
		operation: operate,
		conditional: ($condition, $true, $false) =>
			t.conditionalExpression($condition, $true, $false)
	},
	assign: {
		name: ($left, $right) => t.expressionStatement(
			t.assignmentExpression('=',
				t.identifier($left.identifier),
				$right
			)
		),
		element: ($left, $right) => t.expressionStatement(
			t.assignmentExpression('=',
				t.memberExpression($left.expression, $left.index, true),
				$right
			)
		),
		property: ($left, $right) => t.expressionStatement(
			t.assignmentExpression('=',
				t.memberExpression($left.expression, t.identifier($left.property)),
				$right
			)
		)
	}
};
function operate(operator, left, right) {
	switch (operator) {
		case '*':
			return t.binaryExpression('*', left, right);
		case '/':
			return t.binaryExpression('/', left, right);
		case '+':
			return left != undefined ? t.binaryExpression('+', left, right) : right;
		case '-':
			return left != undefined ? t.binaryExpression('-', left, right) : t.unaryExpression('-', right);
		case '<=':
			return t.binaryExpression('<=', left, right);
		case '=':
			return t.binaryExpression('==', left, right);
		case '>=':
			return t.binaryExpression('>=', left, right);
		case '<':
			return t.binaryExpression('<', left, right);
		case '!=':
			return t.binaryExpression('!=', left, right);
		case '>':
			return t.binaryExpression('>', left, right);
		case '!':
			return t.unaryExpression('!', right);
		case '&':
			return t.binaryExpression('&&', left, right);
		case '|':
			return t.binaryExpression('||', left, right);
	}
}
module.exports = i;

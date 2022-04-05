var t = require("@babel/types");
var Statement = require("../Statement");
var i = {
	expression: {
		undefined: expression => t.unaryExpression("void", t.numericLiteral(0)),
		null: expression => t.nullLiteral(),
		boolean: expression => t.booleanLiteral(expression.value),
		number: expression => t.numericLiteral(expression.value),
		string: expression => t.stringLiteral(expression.value),
		name: expression => t.identifier(escapeIdentifier(expression.identifier)),
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
	statement: {
		'[]': ($statement, $expression) => {
			var labels = $statement.filter(Statement.isLabel);
			var $statement = [
				...$statement.map(
					$statement =>
						Statement.isLabel($statement) ? $statement :
							$statement.type == 'var' ?
								t.variableDeclaration("var", [t.variableDeclarator(t.identifier(escapeIdentifier($statement.identifier)))]) :
								t.expressionStatement($statement)
				),
				t.returnStatement($expression)
			];
			if (labels.length) {
				var $case = [];
				for (var i = -1; i < $statement.length;) {
					var label =
						i < 0 ?
							t.unaryExpression("void", t.numericLiteral(0)) :
							t.stringLiteral($statement[i]);
					i++;
					var consequent = [];
					while (i < $statement.length && !Statement.isLabel($statement[i]))
						consequent.push($statement[i++]);
					$case.push(t.switchCase(label, consequent));
				}
			}
			if (labels.length)
				$statement = [
					t.forStatement(undefined, undefined, undefined, t.blockStatement([
						t.variableDeclaration("var", [t.variableDeclarator(t.identifier('label'))]),
						t.tryStatement(
							t.blockStatement([
								t.switchStatement(
									t.identifier('label'),
									$case
								),
								t.breakStatement()
							]),
							t.catchClause(
								t.identifier('l'),
								t.blockStatement([
									t.ifStatement(
										t.callExpression(
											t.memberExpression(
												t.arrayExpression(
													labels.map(label => t.stringLiteral(label))
												),
												t.identifier('includes')
											),
											[t.identifier('l')]
										),
										t.expressionStatement(
											t.assignmentExpression('=',
												t.identifier('label'),
												t.identifier('l')
											)
										)
									)
								])
							)
						)
					]))
				];
			return iife($statement);
		},
		goto: label => iife([
			t.throwStatement(t.stringLiteral(label))
		])
	},
	assign: {
		name: ($left, $right) => iife([
			t.expressionStatement(
				t.assignmentExpression('=',
					t.identifier(escapeIdentifier($left.identifier)),
					$right
				)
			)
		]),
		element: ($left, $right) => iife([
			t.expressionStatement(
				t.assignmentExpression('=',
					t.memberExpression($left.expression, $left.index, true),
					$right
				)
			)
		]),
		property: ($left, $right) => iife([
			t.expressionStatement(
				t.assignmentExpression('=',
					t.memberExpression($left.expression, t.identifier($left.property)),
					$right
				)
			)
		])
	},
	abstract: $expression => (
		$expression.callee.expression.params.push(t.identifier('argument')),
		$expression.callee.expression
	)
};
function iife(statement) {
	return t.callExpression(
		t.parenthesizedExpression(
			t.functionExpression(t.identifier(''), [], t.blockStatement(
				statement
			))
		),
		[]
	);
}
function escapeIdentifier(identifier) {
	return identifier == 'return' ? '$$return' : identifier;
}
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
			return t.logicalExpression('&&', left, right);
		case '|':
			return t.logicalExpression('||', left, right);
	}
}
module.exports = i;

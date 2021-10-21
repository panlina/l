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
			t.memberExpression($expression, $index, true)
	}
};
module.exports = i;

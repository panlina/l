function generate(expression) {
	switch (expression.type) {
		case 'literal':
			return JSON.stringify(expression.value);
		case 'name':
			return expression.identifier;
		case 'call':
			var $expression = generate(expression.expression);
			if (precedence[expression.expression.type] > precedence[expression.type])
				$expression = `(${$expression})`;
			var argument = generate(expression.argument);
			if (precedence[expression.argument.type] >= precedence[expression.type])
				argument = `(${argument})`;
			return `${$expression} ${argument}`;
	}
}
var precedence = {
	literal: 0,
	name: 0,
	call: 1
};
module.exports = generate;

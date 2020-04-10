var Expression = require('./Expression');
var Statement = require('./Statement');
function generate(program) {
	if (program instanceof Expression) {
		var expression = program;
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
	if (program instanceof Array)
		return program.map(generate).join('');
	if (program instanceof Statement) {
		var statement = program;
		switch (statement.type) {
			case 'assign':
				return `${generate(statement.left)}=${generate(statement.right)};`;
		}
	}
}
var precedence = {
	literal: 0,
	name: 0,
	call: 1
};
module.exports = generate;

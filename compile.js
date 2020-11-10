var Expression = require('./Expression');
var Statement = require('./Statement');
function compile(program, interpretation) {
	if (program instanceof Expression) {
		var expression = program;
		switch (expression.type) {
			case 'literal':
				return interpretation.expression.literal(expression, compile);
			case 'name':
				return interpretation.expression.name(expression, compile);
			case 'object':
				var $property = expression.property.map(
					property => ({
						name: property.name,
						value: compile(property.value, interpretation)
					})
				);
				return interpretation.expression.object($property);
			case 'array':
				var $element = expression.element.map(
					element => compile(element, interpretation)
				);
				return interpretation.expression.array($element);
			case 'tuple':
				var $element = expression.element.map(
					element => compile(element, interpretation)
				);
				return interpretation.expression.tuple($element);
			case 'call':
				var $expression = compile(expression.expression, interpretation),
					$argument = compile(expression.argument, interpretation);
				return interpretation.expression.call($expression, $argument);
		}
	}
	if (program instanceof Array)
		return interpretation.statement['[]'](program, compile);
	if (program instanceof Statement) {
		var statement = program;
		switch (statement.type) {
			case 'assign':
				return interpretation.statement.assign(statement, compile);
		}
	}
}
module.exports = compile;

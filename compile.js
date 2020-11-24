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
			case 'property':
				var $expression = compile(expression.expression, interpretation),
					$property = expression.property;
				return interpretation.expression.property($expression, $property);
			case 'element':
				var $expression = compile(expression.expression, interpretation),
					$index = compile(expression.index, interpretation);
				return interpretation.expression.element($expression, $index);
			case 'call':
				var $expression = compile(expression.expression, interpretation),
					$argument = compile(expression.argument, interpretation);
				return interpretation.expression.call($expression, $argument);
			case 'operation':
				var $left = expression.left && compile(expression.left, interpretation),
					$right = expression.right && compile(expression.right, interpretation),
					$operator = expression.operator;
				return interpretation.expression.operation($operator, $left, $right);
			case 'conditional':
				var $condition = compile(expression.condition, interpretation),
					$true = compile(expression.true, interpretation),
					$false = compile(expression.false, interpretation);
				return interpretation.expression.conditional($condition, $true, $false);
		}
	}
	if (program instanceof Array) {
		var $statement = program.map(statement => compile(statement, interpretation));
		return interpretation.statement['[]']($statement);
	}
	if (program instanceof Statement) {
		var statement = program;
		switch (statement.type) {
			case 'assign':
				switch (statement.left.type) {
					case 'name':
						var $left = {
							type: 'name',
							identifier: statement.left.identifier
						};
						break;
					case 'element':
						var $left = {
							type: 'element',
							expression: compile(statement.left.expression, interpretation),
							index: compile(statement.left.index, interpretation)
						};
						break;
					case 'property':
						var $left = {
							type: 'property',
							expression: compile(statement.left.expression, interpretation),
							property: statement.left.property
						};
						break;
				}
				var $right = compile(statement.right, interpretation);
				return interpretation.statement.assign($left, $right);
			case 'expression':
				var $expression = compile(statement.expression, interpretation);
				return interpretation.statement.expression($expression);
		}
	}
}
module.exports = compile;

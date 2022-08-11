var Expression = require("./Expression");
var Statement = require("./Statement");
var Label = require("./Label");
function children(program) {
	if (program instanceof Expression) {
		var expression = program;
		switch (expression.type) {
			case 'undefined':
			case 'null':
			case 'boolean':
			case 'number':
			case 'string':
			case 'name':
				return [];
			case 'object':
				return expression.property.map(property => property.value);
			case 'array':
				return expression.element;
			case 'tuple':
				return expression.element;
			case 'property':
				return [expression.expression];
			case 'element':
				return [expression.expression, expression.index];
			case 'call':
				return [expression.expression, expression.argument];
			case 'operation':
				return [expression.left, expression.right];
			case 'conditional':
				return [expression.condition, expression.true, expression.false];
			case 'statement':
				return expression.statement;
			case 'function':
				return [expression.argument, expression.expression];
		}
	}
	if (program instanceof Array)
		return program;
	if (program instanceof Statement) {
		var statement = program;
		switch (statement.type) {
			case 'var':
				return [statement.name];
			case 'assign':
				return [statement.left, statement.right];
			case 'block':
				return statement.statement;
			case 'goto':
				return [statement.label];
			case 'expression':
				return [statement.expression];
			case 'while':
				return [statement.condition, statement.statement];
			case 'break':
				return [];
		}
	}
	if (program instanceof Label)
		return [program.name];
}
module.exports = children;

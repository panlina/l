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
			case 'call':
				return interpretation.expression.call(expression, compile);
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

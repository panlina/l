var Scope = require('./Scope');
var Expression = require('./Expression');
var Statement = require('./Statement');
var CompileError = require('./CompileError');
function analyze(program, environment) {
	Object.defineProperty(program, 'environment', { value: environment });
	if (program instanceof Expression) {
		var expression = program;
		switch (expression.type) {
			case 'undefined':
			case 'null':
			case 'boolean':
			case 'number':
			case 'string':
			case 'name':
				break;
			case 'object':
				expression.property.forEach(
					property => { analyze(property.value, environment); }
				);
				break;
			case 'array':
				expression.element.forEach(
					element => { analyze(element, environment); }
				);
				break;
			case 'tuple':
				expression.element.forEach(
					element => { analyze(element, environment); }
				);
				break;
			case 'property':
				analyze(expression.expression, environment);
				break;
			case 'element':
				analyze(expression.expression, environment);
				analyze(expression.index, environment);
				break;
			case 'call':
				analyze(expression.expression, environment);
				analyze(expression.argument, environment);
				break;
			case 'operation':
				if (expression.left) analyze(expression.left, environment);
				if (expression.right) analyze(expression.right, environment);
				break;
			case 'conditional':
				analyze(expression.condition, environment);
				analyze(expression.true, environment);
				analyze(expression.false, environment);
				break;
			case 'statement':
				analyzeStatements(
					[new Statement.Var(new Expression.Name('return')), ...expression.statement],
					new Expression.Name('return'),
					environment
				);
				break;
			case 'function':
				analyzeStatements(
					[
						new Statement.Var(new Expression.Name('return')),
						...name(expression.argument).map(n => new Statement.Var(n))
					],
					expression.expression,
					environment
				);
				function name(argument) {
					switch (argument.type) {
						case 'name': return [argument];
						case 'array': case 'tuple': return argument.element.map(name).flat();
						case 'object': return argument.property.map(p => name(p.value)).flat();
						default: throw new CompileError.InvalidFunctionParameter(expression);
					}
				}
				break;
		}
	}
	if (program instanceof Array)
		analyzeStatements(
			[new Statement.Var(new Expression.Name('return')), ...program],
			new Expression.Name('return'),
			environment
		);
	if (program instanceof Statement) {
		var statement = program;
		switch (statement.type) {
			case 'assign':
				analyze(statement.left, environment);
				analyze(statement.right, environment);
				break;
			case 'block':
				analyzeStatements(
					statement.statement,
					new Expression.Undefined(),
					environment
				);
				break;
			case 'goto':
				break;
			case 'expression':
				analyze(statement.expression, environment);
				break;
			case 'while':
				analyze(statement.condition, environment);
				analyze(statement.statement, environment);
				break;
			case 'break':
				break;
		}
	}
	function analyzeStatements(statement, expression, environment) {
		var name = statement
			.filter(statement =>
				Statement.isLabel(statement)
				||
				statement.type == 'var'
			);
		var name = name.reduce(
			(name, v) => (
				name[Statement.isLabel(v) ? v : v.name.identifier] = Statement.isLabel(v) ? 'label' : 'variable',
				name
			), {}
		);
		var e = environment.push(new Scope(name));
		statement
			.forEach(statement => {
				if (!(Statement.isLabel(statement) || statement.type == 'var'))
					analyze(statement, e);
			});
		analyze(expression, e);
	}
}
module.exports = analyze;

var Scope = require('./Scope');
var Expression = require('./Expression');
var Statement = require('./Statement');
var Label = require('./Label');
var Error = require('./Error');
var extractFunctionArgumentNames = require('./extractFunctionArgumentNames');
function analyze(program, environment, parent) {
	Object.defineProperty(program, 'environment', { value: environment });
	Object.defineProperty(program, 'parent', { value: parent });
	if (program instanceof Expression) {
		var expression = program;
		switch (expression.type) {
			case 'undefined':
			case 'null':
			case 'boolean':
			case 'number':
			case 'string':
				break;
			case 'name':
				var resolution = environment.resolve(expression.identifier);
				if (!resolution) { assignError(new Error.UndefinedName(expression)); break; }
				var [type, scope] = resolution;
				if (parent instanceof Statement && parent.type == 'goto') {
					if (type != 'label') assignError(new Error.LabelNameExpected(expression));
				}
				else
					if (type != 'variable') assignError(new Error.VariableNameExpected(expression));
				break;
			case 'object':
				expression.property.forEach(
					property => { analyze(property.value, environment, program); }
				);
				break;
			case 'array':
				expression.element.forEach(
					element => { analyze(element, environment, program); }
				);
				break;
			case 'tuple':
				expression.element.forEach(
					element => { analyze(element, environment, program); }
				);
				break;
			case 'property':
				analyze(expression.expression, environment, program);
				break;
			case 'element':
				analyze(expression.expression, environment, program);
				analyze(expression.index, environment, program);
				break;
			case 'call':
				analyze(expression.expression, environment, program);
				analyze(expression.argument, environment, program);
				break;
			case 'operation':
				if (expression.left) analyze(expression.left, environment, program);
				if (expression.right) analyze(expression.right, environment, program);
				break;
			case 'conditional':
				analyze(expression.condition, environment, program);
				analyze(expression.true, environment, program);
				analyze(expression.false, environment, program);
				break;
			case 'statement':
				analyzeStatements(
					[new Statement.Var(new Expression.Name('return')), ...expression.statement],
					new Expression.Name('return'),
					environment
				);
				break;
			case 'function':
				var name = [];
				for (var n of extractFunctionArgumentNames(expression.argument))
					if (n instanceof Error.InvalidFunctionParameter) assignError(n);
					else name.push(n);
				analyzeStatements(
					[
						new Statement.Var(new Expression.Name('return')),
						...name.map(n => new Statement.Var(n))
					],
					expression.expression,
					environment
				);
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
			case 'var':
				// TODO: This duplicates implementation of analyze. A refactor is needed to remove it.
				Object.defineProperty(statement.name, 'parent', { value: statement });
				break;
			case 'assign':
				if (!(statement.left.type in { name: 0, element: 0, property: 0, array: 0, tuple: 0, object: 0 }))
					assignError(new Error.InvalidAssignee(statement.left));
				analyze(statement.left, environment, program);
				analyze(statement.right, environment, program);
				break;
			case 'block':
				analyzeStatements(
					statement.statement,
					new Expression.Undefined(),
					environment
				);
				break;
			case 'goto':
				analyze(statement.label, environment, program);
				break;
			case 'expression':
				analyze(statement.expression, environment, program);
				break;
			case 'while':
				analyze(statement.condition, environment, program);
				analyze(statement.statement, environment, program);
				break;
			case 'break':
				var p = parent;
				while (p) {
					if (p instanceof Statement && p.type == 'while')
						break;
					p = p.parent;
				}
				if (!p)
					assignError(new Error.BreakOutsideWhile(statement));
				break;
		}
	}
	if (program instanceof Label) {
		var label = program;
		// TODO: This duplicates implementation of analyze. A refactor is needed to remove it.
		Object.defineProperty(label.name, 'parent', { value: label });
	}
	if (program instanceof Expression)
		if (program.type == 'name' && program.environment) {
			var name = program;
			Object.defineProperty(program, 'definition', {
				get: () => {
					var resolution = name.environment.resolve(name.identifier);
					if (resolution) {
						var [type, scope] = resolution;
						return scope.definition[name.identifier];
					}
				}
			})
		}
	function assignError(error) {
		Object.defineProperty(error.program, 'error', { value: error });
	}
	function analyzeStatements(statement, expression, environment) {
		var name = statement
			.filter(statement =>
				statement instanceof Label
				||
				statement.type == 'var'
			);
		var definition = name.reduce(
			(name, v) => (
				name[v instanceof Label ? v.name.identifier : v.name.identifier] = v instanceof Label ? v.name : v.name,
				name
			), {}
		);
		var name = name.reduce(
			(name, v) => (
				name[v instanceof Label ? v.name.identifier : v.name.identifier] = v instanceof Label ? 'label' : 'variable',
				name
			), {}
		);
		var scope = new Scope(name);
		Object.defineProperty(scope, 'definition', { value: definition });
		var e = environment.push(scope);
		statement
			.forEach(statement => {
				analyze(statement, e, program);
			});
		analyze(expression, e, program);
	}
}
module.exports = analyze;

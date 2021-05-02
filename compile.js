const { Scope } = require('.');
var Expression = require('./Expression');
var Statement = require('./Statement');
var CompileError = require('./CompileError');
function compile(program, environment, interpretation) {
	if (program instanceof Expression) {
		var expression = program;
		switch (expression.type) {
			case 'literal':
				return interpretation.expression.literal(expression, compile);
			case 'name':
				var resolution = environment.resolve(expression.identifier);
				if (!resolution) throw new CompileError.UndefinedName(expression);
				var [type, depth] = resolution;
				if (type != 'variable') throw new CompileError.UndefinedName(expression);
				return interpretation.expression.name(expression, resolution);
			case 'object':
				var $property = expression.property.map(
					property => ({
						name: property.name,
						value: compile(property.value, environment, interpretation)
					})
				);
				return interpretation.expression.object($property);
			case 'array':
				var $element = expression.element.map(
					element => compile(element, environment, interpretation)
				);
				return interpretation.expression.array($element);
			case 'tuple':
				var $element = expression.element.map(
					element => compile(element, environment, interpretation)
				);
				return interpretation.expression.tuple($element);
			case 'property':
				var $expression = compile(expression.expression, environment, interpretation),
					$property = expression.property;
				return interpretation.expression.property($expression, $property);
			case 'element':
				var $expression = compile(expression.expression, environment, interpretation),
					$index = compile(expression.index, environment, interpretation);
				return interpretation.expression.element($expression, $index);
			case 'call':
				var $expression = compile(expression.expression, environment, interpretation),
					$argument = compile(expression.argument, environment, interpretation);
				return interpretation.expression.call($expression, $argument);
			case 'operation':
				var $left = expression.left && compile(expression.left, environment, interpretation),
					$right = expression.right && compile(expression.right, environment, interpretation),
					$operator = expression.operator;
				return interpretation.expression.operation($operator, $left, $right);
			case 'conditional':
				var $condition = compile(expression.condition, environment, interpretation),
					$true = compile(expression.true, environment, interpretation),
					$false = compile(expression.false, environment, interpretation);
				return interpretation.expression.conditional($condition, $true, $false);
			case 'statement':
				var e = environment.push(new Scope({ return: 'variable' }));
				return interpretation.pushScope(
					interpretation.concat(
						compileStatements(expression.statement, e),
						compile(new Expression.Name('return'), e, interpretation)
					)
				);
			case 'function':
				var e = environment.push(new Scope({ [expression.argument]: 'variable', return: 'variable' }));
				var $expression = compile(expression.expression, e, interpretation);
				return interpretation.expression.function(expression.argument, $expression);
		}
	}
	if (program instanceof Array)
		return interpretation.concat(
			compileStatements(program, environment),
			interpretation.expression.literal(new Expression.Literal(undefined))
		);
	if (program instanceof Statement) {
		var statement = program;
		switch (statement.type) {
			case 'assign':
				switch (statement.left.type) {
					case 'name':
						var $left = {
							type: 'name',
							identifier: statement.left.identifier,
							resolution: environment.resolve(statement.left.identifier)
						};
						if (!$left.resolution) throw new CompileError.UndefinedName(statement.left);
						break;
					case 'element':
						var $left = {
							type: 'element',
							expression: compile(statement.left.expression, environment, interpretation),
							index: compile(statement.left.index, environment, interpretation)
						};
						break;
					case 'property':
						var $left = {
							type: 'property',
							expression: compile(statement.left.expression, environment, interpretation),
							property: statement.left.property
						};
						break;
				}
				var $right = compile(statement.right, environment, interpretation);
				return interpretation.assign[$left.type]($left, $right);
			case 'block':
				return interpretation.concat(
					compileStatements(statement.statement, environment),
					interpretation.expression.literal(new Expression.Literal(undefined))
				);
			case 'goto':
				var resolution = environment.resolve(statement.label);
				if (!resolution) throw new CompileError.UndefinedLabel(statement);
				var [type, depth] = resolution;
				if (type != 'label') throw new CompileError.UndefinedLabel(statement);
				return interpretation.statement.goto(statement.label);
			case 'expression':
				return interpretation.concat(
					compile(statement.expression, environment, interpretation),
					interpretation.expression.literal(new Expression.Literal(undefined))
				);
			case 'while':
				return compile([
					'while:before',
					new Statement.Expression(
						new Expression.Conditional(
							statement.condition,
							new Expression.Statement([
								statement.statement,
								new Statement.Goto('while:before')
							]),
							new Expression.Statement([])
						)
					),
					'while:after'
				], environment, interpretation);
			case 'break':
				var resolution = environment.resolve("while:after");
				if (!resolution) throw new CompileError.BreakOutsideWhile(statement);
				var [type, depth] = resolution;
				if (type != 'label') throw new CompileError.BreakOutsideWhile(statement);
				return interpretation.statement.goto("while:after");
		}
	}
	function compileStatements(program, environment) {
		var name = program
			.filter(statement =>
				typeof statement == 'string'
				||
				statement.type == 'var'
			);
		var name = name.reduce(
			(name, v) => (
				name[typeof v == 'string' ? v : v.identifier] = typeof v == 'string' ? 'label' : 'variable',
				name
			), {}
		);
		var e = environment.push(new Scope(name));
		var $statement =
			program
				.filter(statement =>
					typeof statement == 'string'
					||
					statement.type != 'var'
				)
				.map(statement =>
					typeof statement == 'string' ?
						statement :
						compile(statement, e, interpretation)
				);
		return interpretation.pushScope(interpretation.statement['[]']($statement));
	}
}
module.exports = compile;

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
				var e = environment.push(new Scope({ return: null }));
				var $statement = expression.statement.map(statement => compile(statement, e, interpretation));
				return interpretation.concat(
					interpretation.statement['[]']($statement),
					compile(new Expression.Name('return'), e, interpretation),
					environment => environment.push(new Scope({}))
				);
			case 'function':
				var e = environment.push(new Scope({ argument: null, return: null }));
				var $expression = compile(expression.expression, e, interpretation);
				return interpretation.expression.function($expression);
		}
	}
	if (program instanceof Array) {
		var $statement = program.map(statement => compile(statement, environment, interpretation));
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
				var e = environment.push(new Scope({}));
				var $statement = statement.statement.map(statement => compile(statement, e, interpretation));
				return interpretation.concat(
					interpretation.statement['[]']($statement),
					interpretation.expression.literal(new Expression.Literal(undefined)),
					environment => environment.push(new Scope({}))
				);
			case 'var':
				environment.scope[statement.identifier] = null;
				return compile(new Statement.Block([]), environment, interpretation);
			case 'expression':
				return interpretation.concat(
					compile(statement.expression, environment, interpretation),
					interpretation.expression.literal(new Expression.Literal(undefined))
				);
		}
	}
}
module.exports = compile;

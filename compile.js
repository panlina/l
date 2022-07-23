var Scope = require('./Scope');
var Expression = require('./Expression');
var Statement = require('./Statement');
var CompileError = require('./CompileError');
var i = 0;
function I() { return i++; }
function compile(program, environment, interpretation) {
	if (program instanceof Expression) {
		var expression = program;
		switch (expression.type) {
			case 'undefined':
				return interpretation.expression.undefined(expression);
			case 'null':
				return interpretation.expression.null(expression);
			case 'boolean':
				return interpretation.expression.boolean(expression);
			case 'number':
				return interpretation.expression.number(expression);
			case 'string':
				return interpretation.expression.string(expression);
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
				return compileStatements(
					[new Statement.Var(new Expression.Name('return')), ...expression.statement],
					new Expression.Name('return'),
					environment
				);
			case 'function':
				return interpretation.abstract(
					compileStatements(
						[
							new Statement.Var(new Expression.Name('return')),
							...name(expression.argument).map(n => new Statement.Var(n)),
							new Statement.Assign(expression.argument, new Expression.Name('argument'))
						],
						expression.expression,
						environment.push(new Scope({ argument: 'variable' }))
					)
				);
				function name(argument) {
					switch (argument.type) {
						case 'name': return [argument];
						case 'array': case 'tuple': return argument.element.map(name).flat();
						case 'object': return argument.property.map(p => name(p.value)).flat();
						default: throw new CompileError.InvalidFunctionParameter(expression);
					}
				}
		}
	}
	if (program instanceof Array)
		return compileStatements(
			[new Statement.Var(new Expression.Name('return')), ...program],
			new Expression.Name('return'),
			environment
		);
	if (program instanceof Statement) {
		var statement = program;
		switch (statement.type) {
			case 'assign':
				switch (statement.left.type) {
					case 'name':
						var $left = {
							type: 'name',
							expression: statement.left,
							resolution: environment.resolve(statement.left.identifier)
						};
						if (!$left.resolution) throw new CompileError.UndefinedName(statement.left);
						var [type, depth] = $left.resolution;
						if (type != 'variable') throw new CompileError.UndefinedName(statement.left);
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
					case 'array':
					case 'tuple':
						var i = I();
						return compileStatements(
							[
								new Statement.Var(new Expression.Name(`.t${i}`)),
								new Statement.Assign(new Expression.Name(`.t${i}`), statement.right),
								...statement.left.element.map(
									(e, j) => new Statement.Assign(
										e,
										new Expression.Element(
											new Expression.Name(`.t${i}`),
											new Expression.Number(j)
										)
									)
								)
							],
							new Expression.Undefined(),
							environment
						);
						break;
					case 'object':
						var i = I();
						return compileStatements(
							[
								new Statement.Var(new Expression.Name(`.t${i}`)),
								new Statement.Assign(new Expression.Name(`.t${i}`), statement.right),
								...statement.left.property.map(
									p => new Statement.Assign(
										p.value,
										new Expression.Property(
											new Expression.Name(`.t${i}`),
											p.name
										)
									)
								)
							],
							new Expression.Undefined(),
							environment
						);
						break;
					default:
						throw new CompileError.InvalidAssignment(statement);
				}
				var $right = compile(statement.right, environment, interpretation);
				return interpretation.assign[$left.type]($left, $right);
			case 'block':
				return compileStatements(
					statement.statement,
					new Expression.Undefined(),
					environment
				);
			case 'goto':
				var resolution = environment.resolve(statement.label.identifier);
				if (!resolution) throw new CompileError.UndefinedLabel(statement);
				var [type, depth] = resolution;
				if (type != 'label') throw new CompileError.UndefinedLabel(statement);
				return interpretation.statement.goto(statement.label);
			case 'expression':
				return compileStatements(
					[statement.expression],
					new Expression.Undefined(),
					environment
				);
			case 'while':
				return compile([
					'while:before',
					new Statement.Expression(
						new Expression.Conditional(
							statement.condition,
							new Expression.Statement([
								statement.statement,
								new Statement.Goto(new Expression.Name('while:before'))
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
				return interpretation.statement.goto(new Expression.Name("while:after"));
		}
	}
	function compileStatements(statement, expression, environment) {
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
		var $statement =
			statement
				.map(statement =>
					Statement.isLabel(statement) || statement.type == 'var' ?
						statement :
						compile(statement, e, interpretation)
				);
		var $expression = compile(expression, e, interpretation);
		return interpretation.statement['[]']($statement, $expression);
	}
}
module.exports = compile;

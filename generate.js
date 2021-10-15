var Expression = require('./Expression');
var Statement = require('./Statement');
function generate(program) {
	if (program instanceof Expression) {
		var expression = program;
		switch (expression.type) {
			case 'undefined':
				return `#${undefined}`;
			case 'null':
				return `#${null}`;
			case 'boolean':
				return `#${expression.value}`;
			case 'number':
				return JSON.stringify(expression.value);
			case 'string':
				return JSON.stringify(expression.value);
			case 'name':
				return expression.identifier;
			case 'object':
				return `{${expression.property.map(property => `${property.name}:${generate(property.value)}`).join(',')}}`;
			case 'array':
				return `[${expression.element.map(element => generate(element)).join(',')}]`;
			case 'tuple':
				return `{${expression.element.map(element => generate(element)).join(',')}}`;
			case 'property':
				var $expression = generate(expression.expression);
				if (precedence[expression.expression.type] > precedence[expression.type])
					$expression = `(${$expression})`;
				return `${$expression}.${expression.property}`;
			case 'element':
				var $expression = generate(expression.expression);
				if (precedence[expression.expression.type] > precedence[expression.type])
					$expression = `(${$expression})`;
				var $index = generate(expression.index);
				if (precedence[expression.index.type] >= precedence[expression.type])
					$index = `(${$index})`;
				return `${$expression}@${$index}`;
			case 'call':
				var $expression = generate(expression.expression);
				if (precedence[expression.expression.type] >= precedence[expression.type])
					$expression = `(${$expression})`;
				var $argument = generate(expression.argument);
				if (precedence[expression.argument.type] > precedence[expression.type])
					$argument = `(${$argument})`;
				return `${$expression} ${$argument}`;
			case 'operation':
				if (expression.left) {
					var $left = generate(expression.left);
					if (
						precedence[expression.left.type] > precedence[expression.type]
						||
						precedence[expression.left.type] == precedence[expression.type]
						&&
						operatorPrecedence(expression.left) > operatorPrecedence(expression)
					)
						$left = `(${$left})`;
				}
				if (expression.right) {
					var $right = generate(expression.right);
					if (
						precedence[expression.right.type] > precedence[expression.type]
						||
						precedence[expression.right.type] == precedence[expression.type]
						&&
						operatorPrecedence(expression.right) >= operatorPrecedence(expression)
					)
						$right = `(${$right})`;
				}
				var $operator = expression.operator;
				return `${$left || ''}${$operator}${$right || ''}`;
				function operatorPrecedence(expression) {
					return require('./operator').resolve(
						expression.operator,
						!!expression.left,
						!!expression.right
					).precedence;
				}
			case 'conditional':
				var $condition = generate(expression.condition);
				if (precedence[expression.condition.type] > precedence[expression.type])
					$condition = `(${$condition})`;
				var $true = generate(expression.true);
				if (precedence[expression.true.type] > precedence[expression.type])
					$true = `(${$true})`;
				var $false = generate(expression.false);
				if (precedence[expression.false.type] > precedence[expression.type])
					$false = `(${$false})`;
				return `${$condition}?${$true}:${$false}`;
			case 'statement':
				var $statement = generate(expression.statement);
				return `(${$statement})`;
			case 'function':
				var $expression = generate(expression.expression);
				if (precedence[expression.expression.type] > precedence[expression.type])
					$expression = `(${$expression})`;
				var $argument = generate(expression.argument);
				return `${$argument}=>${$expression}`;
			case 'placeholder':
				return `%${expression.name}%`;
		}
	}
	if (program instanceof Array)
		return program.map(
			statement =>
				Statement.isLabel(statement) ?
					`${statement}:` :
					generate(statement)
		).join('');
	if (program instanceof Statement) {
		var statement = program;
		switch (statement.type) {
			case 'assign':
				return `let ${generate(statement.left)}=${generate(statement.right)};`;
			case 'var':
				return `var ${statement.identifier};`;
			case 'block':
				return `{${statement.statement.map(generate).join('')}}`;
			case 'goto':
				return `goto ${statement.label};`;
			case 'expression':
				var $expression = generate(statement.expression);
				return `${$expression};`;
			case 'while':
				return `while ${generate(statement.condition)} do ${generate(statement.statement)}`;
			case 'break':
				return "break;";
			case 'placeholder':
				return `%${statement.name}%`;
		}
	}
}
var precedence = {
	undefined: 0,
	null: 0,
	boolean: 0,
	number: 0,
	string: 0,
	name: 0,
	property: 1,
	element: 1,
	call: 2,
	operation: 3,
	conditional: 4,
	function: 5
};
module.exports = generate;

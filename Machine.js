var RuntimeError = require('./RuntimeError');
class Machine {
	constructor(environment) {
		this.environment = environment;
	}
	execute(statement) {
		switch (statement.type) {
			case 'assign':
				var resolution = this.environment.resolve(statement.left.identifier);
				if (!resolution) throw new RuntimeError.UndefinedName(statement.left);
				var [, scope] = resolution;
				scope.name[statement.left.identifier] = this.evaluate(statement.right);
				break;
		}
	}
	evaluate(expression) {
		switch (expression.type) {
			case 'undefined':
			case 'null':
			case 'boolean':
			case 'number':
			case 'string':
				return expression;
			case 'name':
				var resolution = this.environment.resolve(expression.identifier);
				if (!resolution) throw new RuntimeError.UndefinedName(expression);
				var [value] = resolution;
				return value;
		}
	}
}
module.exports = Machine;

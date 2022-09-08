import Expression = require('./Expression');
import Statement = require('./Statement');
import Environment = require('./Environment');
import Value = require('./Value');
declare class Machine {
	constructor(environment: Environment<Value>);
	environment: Environment<Value>;
	execute(statement: Statement): void;
	evaluate(expression: Expression): Value;
}
export = Machine;

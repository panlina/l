import Expression = require('./Expression');
import Statement = require('./Statement');
import Program = require('./Program');
import Environment = require('./Environment');
import Value = require('./Value');
declare class Machine {
	constructor(environment: Environment<Value>, program: Program);
	environment: Environment<Value>;
	program: Program;
	execute(statement: Statement): void;
	evaluate(expression: Expression): Value;
}
export = Machine;

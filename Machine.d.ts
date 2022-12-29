import Expression = require('./Expression');
import Statement = require('./Statement');
import Program = require('./Program');
import Environment = require('./Environment');
import Value = require('./Value');
declare class Machine {
	constructor(environment: Environment<Value>);
	environment: Environment<Value>;
	current: Expression | Statement;
	return: Value | undefined;
	callstack: Expression.Call[];
	step(): boolean;
	run(program: Program): void;
	execute(statement: Statement): void;
	evaluate(expression: Expression): Value;
}
export = Machine;

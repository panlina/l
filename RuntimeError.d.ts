import Expression = require('./Expression');
import Statement = require('./Statement');
declare class RuntimeError extends Error {
	constructor(program: Expression | Statement);
}
declare namespace RuntimeError {
	export class UndefinedName extends RuntimeError {
		constructor(expression: Expression);
	}
}
export = RuntimeError;

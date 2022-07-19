import Expression = require('./Expression');
import Statement = require('./Statement');
import Program = require('./Program');
declare class CompileError extends Error {
	constructor(program: Program);
}
declare namespace CompileError {
	export class UndefinedName extends CompileError {
		constructor(expression: Expression);
	}
	export class UndefinedLabel extends CompileError {
		constructor(statement: Statement);
	}
	export class BreakOutsideWhile extends CompileError {
		constructor(statement: Statement);
	}
	export class InvalidAssignment extends CompileError {
		constructor(statement: Statement);
	}
	export class InvalidFunctionParameter extends CompileError {
		constructor(expression: Expression);
	}
}
export = CompileError;

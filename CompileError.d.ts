import Expression = require('./Expression');
import Statement = require('./Statement');
declare class CompileError extends Error {
	constructor(program: Expression | Statement);
}
declare namespace CompileError {
	export class UndefinedName extends CompileError {
		constructor(expression: Expression);
	}
	export class UndefinedLabel extends CompileError {
		constructor(label: Expression.Name);
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
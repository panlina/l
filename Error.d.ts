import Expression = require('./Expression');
import Statement = require('./Statement');
declare class Error extends globalThis.Error {
	constructor(program: Expression | Statement);
}
declare namespace Error {
	export class UndefinedName extends Error {
		constructor(expression: Expression);
	}
	export class VariableNameExpected extends Error {
		constructor(name: Expression.Name);
	}
	export class LabelNameExpected extends Error {
		constructor(name: Expression.Name);
	}
	export class BreakOutsideWhile extends Error {
		constructor(statement: Statement);
	}
	export class InvalidAssignee extends Error {
		constructor(expression: Expression);
	}
	export class InvalidFunctionParameter extends Error {
		constructor(expression: Expression);
	}
	export class FunctionExpected extends Error {
		constructor(expression: Expression);
	}
	export class ArrayOrTupleExpected extends Error {
		constructor(expression: Expression);
	}
	export class NumberExpected extends Error {
		constructor(expression: Expression);
	}
	export class ArrayOrTupleIndexOutOfBound extends Error {
		constructor(expression: Expression);
	}
	export class ObjectExpected extends Error {
		constructor(expression: Expression);
	}
	export class WrongOperandType extends Error {
		constructor(expression: Expression);
	}
}
export = Error;

class CompileError extends Error {
	constructor(program) {
		super();
		this.program = program;
	}
}
class UndefinedName extends CompileError {
	constructor(expression) { super(expression); }
	get message() { return `'${this.program.identifier}' is not defined.`; }
}
class UndefinedLabel extends CompileError {
	constructor(statement) { super(statement); }
	get message() { return `'${this.program.label.identifier}' is not defined.`; }
}
class BreakOutsideWhile extends CompileError {
	constructor(statement) { super(statement); }
	get message() { return `break must be inside while.`; }
}
class InvalidAssignment extends CompileError {
	constructor(statement) { super(statement); }
	get message() { return `cannot assign to ${this.program.left.type} expression.`; }
}
class InvalidFunctionParameter extends CompileError {
	constructor(expression) { super(expression); }
	get message() { return `function parameter is invalid.`; }
}
CompileError.UndefinedName = UndefinedName;
CompileError.UndefinedLabel = UndefinedLabel;
CompileError.BreakOutsideWhile = BreakOutsideWhile;
CompileError.InvalidAssignment = InvalidAssignment;
CompileError.InvalidFunctionParameter = InvalidFunctionParameter;
module.exports = CompileError;

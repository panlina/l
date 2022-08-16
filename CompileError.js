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
class VariableNameExpected extends CompileError {
	constructor(name) { super(name); }
	get message() { return `'${this.program.identifier}' refers to a label where a variable is expected.`; }
}
class LabelNameExpected extends CompileError {
	constructor(name) { super(name); }
	get message() { return `'${this.program.identifier}' refers to a variable where a label is expected.`; }
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
CompileError.VariableNameExpected = VariableNameExpected;
CompileError.LabelNameExpected = LabelNameExpected;
CompileError.BreakOutsideWhile = BreakOutsideWhile;
CompileError.InvalidAssignment = InvalidAssignment;
CompileError.InvalidFunctionParameter = InvalidFunctionParameter;
module.exports = CompileError;

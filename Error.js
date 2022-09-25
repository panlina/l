class Error extends global.Error {
	constructor(program) {
		super();
		this.program = program;
	}
}
class UndefinedName extends Error {
	constructor(expression) { super(expression); }
	get message() { return `'${this.program.identifier}' is not defined.`; }
}
class VariableNameExpected extends Error {
	constructor(name) { super(name); }
	get message() { return `'${this.program.identifier}' refers to a label where a variable is expected.`; }
}
class LabelNameExpected extends Error {
	constructor(name) { super(name); }
	get message() { return `'${this.program.identifier}' refers to a variable where a label is expected.`; }
}
class BreakOutsideWhile extends Error {
	constructor(statement) { super(statement); }
	get message() { return `break must be inside while.`; }
}
class InvalidAssignment extends Error {
	constructor(statement) { super(statement); }
	get message() { return `cannot assign to ${this.program.left.type} expression.`; }
}
class InvalidFunctionParameter extends Error {
	constructor(expression) { super(expression); }
	get message() { return `function parameter is invalid.`; }
}
Error.UndefinedName = UndefinedName;
Error.VariableNameExpected = VariableNameExpected;
Error.LabelNameExpected = LabelNameExpected;
Error.BreakOutsideWhile = BreakOutsideWhile;
Error.InvalidAssignment = InvalidAssignment;
Error.InvalidFunctionParameter = InvalidFunctionParameter;
module.exports = Error;

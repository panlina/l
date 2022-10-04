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
class InvalidAssignee extends Error {
	constructor(expression) { super(expression); }
	get message() { return `cannot assign to ${this.program.type} expression.`; }
}
class InvalidFunctionParameter extends Error {
	constructor(expression) { super(expression); }
	get message() { return `function parameter is invalid.`; }
}
class FunctionExpected extends Error {
	constructor(expression) { super(expression); }
	get message() { return `function expected.`; }
}
class ArrayOrTupleExpected extends Error {
	constructor(expression) { super(expression); }
	get message() { return `array or tuple expected.`; }
}
class NumberExpected extends Error {
	constructor(expression) { super(expression); }
	get message() { return `number expected.`; }
}
class ArrayOrTupleIndexOutOfBound extends Error {
	constructor(expression) { super(expression); }
	get message() { return `number expected.`; }
}
class ObjectExpected extends Error {
	constructor(expression) { super(expression); }
	get message() { return `object expected.`; }
}
Error.UndefinedName = UndefinedName;
Error.VariableNameExpected = VariableNameExpected;
Error.LabelNameExpected = LabelNameExpected;
Error.BreakOutsideWhile = BreakOutsideWhile;
Error.InvalidAssignee = InvalidAssignee;
Error.InvalidFunctionParameter = InvalidFunctionParameter;
Error.FunctionExpected = FunctionExpected;
Error.ArrayOrTupleExpected = ArrayOrTupleExpected;
Error.NumberExpected = NumberExpected;
Error.ArrayOrTupleIndexOutOfBound = ArrayOrTupleIndexOutOfBound;
Error.ObjectExpected = ObjectExpected;
module.exports = Error;

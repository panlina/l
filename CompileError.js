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
	get message() { return `'${this.program.label}' is not defined.`; }
}
CompileError.UndefinedName = UndefinedName;
CompileError.UndefinedLabel = UndefinedLabel;
module.exports = CompileError;

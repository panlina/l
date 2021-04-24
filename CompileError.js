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
CompileError.UndefinedName = UndefinedName;
module.exports = CompileError;

class RuntimeError extends Error {
	constructor(program) {
		super();
		this.program = program;
	}
}
class UndefinedName extends RuntimeError {
	constructor(expression) { super(expression); }
	get message() { return `'${this.program.identifier}' is not defined.`; }
}
RuntimeError.UndefinedName = UndefinedName;
module.exports = RuntimeError;

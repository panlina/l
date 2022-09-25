var Error = require('./Error');
function* extractFunctionArgumentNames(argument) {
	switch (argument.type) {
		case 'name': yield argument; break;
		case 'array': case 'tuple':
			for (var element of argument.element)
				yield* extractFunctionArgumentNames(element);
			break;
		case 'object':
			for (var p of argument.property)
				yield* extractFunctionArgumentNames(p.value);
			break;
		default: yield new Error.InvalidFunctionParameter(argument);
	}
}
module.exports = extractFunctionArgumentNames;

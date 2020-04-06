function compile(expression, interpretation) {
	switch (expression.type) {
		case 'literal':
			return interpretation.literal(expression, compile);
		case 'name':
			return interpretation.name(expression, compile);
		case 'call':
			return interpretation.call(expression, compile);
	}
}
module.exports = compile;

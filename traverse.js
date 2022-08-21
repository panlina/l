var children = require('./children');
function* traverse(program) {
	yield program;
	for (var child of children(program))
		yield* traverse(child);
}
module.exports = traverse;

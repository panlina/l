var children = require('./children');
function programAt(program, position) {
	if ('node' in program)
		if (
			program.node.source.startIdx <= position
			&&
			program.node.source.endIdx >= position
		)
			var p = program;
	for (var child of children(program)) {
		var q = programAt(child, position);
		if (q) p = q;
	}
	return p;
}
module.exports = programAt;

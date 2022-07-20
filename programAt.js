function programAt(program, position) {
	switch (typeof program) {
		case 'object':
			if ('node' in program)
				if (
					program.node.source.startIdx <= position
					&&
					program.node.source.endIdx >= position
				)
					var p = program;
			for (var key in program) {
				var q = programAt(program[key], position);
				if (q) p = q;
			}
			return p;
	}
}
module.exports = programAt;

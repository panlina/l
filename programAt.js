function programAt(program, position) {
	switch (typeof program) {
		case 'object':
			if ('nodeWrapper' in program)
				if (
					program.nodeWrapper.source.startIdx <= position
					&&
					program.nodeWrapper.source.endIdx >= position
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

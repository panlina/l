module.exports = {
	environment: {},
	program: `
		var y; let y = (f => (x => x x) (x => f (y => (x x) y)));
		var f; let f = y (f => (n => n > 1 ? n * f (n - 1) : 1));
		let return = f 4;
	`,
	return: 24
};

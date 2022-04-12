module.exports = {
	environment: {},
	program: `
		var n;
		let n = 10;
		while #true do {
			n = 4 ? (break;) : 0;
			let n = n - 1;
		}
		let return = n;
	`,
	return: 4
};

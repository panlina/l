module.exports = {
	environment: {},
	program: `
		var s;
		let s = 0;
		var n;
		let n = 1;
		while n <= 10 do {
			let s = s + n;
			let n = n + 1;
		}
		let return = s;
	`,
	return: 55
};

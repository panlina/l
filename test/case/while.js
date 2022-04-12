module.exports = {
	environment: {},
	program: `
		var n;
		let n = 10;
		while n > 4 do
			let n = n - 1;
		let return = n;
	`,
	return: 4
};

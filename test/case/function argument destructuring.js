module.exports = {
	environment: {},
	program: "var f; let f = ([a, { b: b, c: c }] => a + b * c); let return = f [1, { b: 2, c: 3 }];",
	return: 7
};

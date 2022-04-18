module.exports = {
	environment: {},
	program: "var f; let f = (a => (b => b + b + a)); var g; let g = f 1; let return = g 2;",
	return: 5
};

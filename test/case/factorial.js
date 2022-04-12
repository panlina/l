module.exports = {
	environment: {},
	program: "var f; let f = (n => n > 1 ? n * f (n - 1) : 1); let return = f 4;",
	return: 24
};

module.exports = {
	environment: {},
	program: "var a; let a = 0; { var a; let a = 1; } let return = a;",
	return: 0
};

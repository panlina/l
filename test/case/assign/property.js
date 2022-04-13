module.exports = {
	environment: { a: { b: 0 } },
	program: "let a.b = 1;",
	effect: { a: { b: 1 } }
};

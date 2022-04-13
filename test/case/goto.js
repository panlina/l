module.exports = {
	environment: {a:0},
	program: "goto L; let a = a + 1; L: let a = a + 2;",
	effect: { a: 2 }
};

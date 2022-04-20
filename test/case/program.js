module.exports = {
	environment: { a: 0 },
	program: "let a = 1; var b; let b = a + 1; let a = b;",
	effect: { a: 2 }
};

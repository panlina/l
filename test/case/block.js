module.exports = {
	environment: { a: 0, b: 1 },
	program: "{ let a = 1; let b = 2; }",
	effect: { a: 1, b: 2 }
};

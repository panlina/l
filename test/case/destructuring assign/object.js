module.exports = {
	environment: { a: undefined },
	program: "let { a: a } = { a: 0, b: 1 };",
	effect: { a: 0 }
};

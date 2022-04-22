module.exports = {
	environment: { a: undefined, b: undefined, c: undefined },
	program: "let { a: a, bc: { b: b, c: c } } = { a: 0, bc: { b: 1, c: 2 } };",
	effect: { a: 0, b: 1, c: 2 }
};

module.exports = {
	environment: {},
	program: "{ a: #null, b: [#false, {123, \"abc\"}] }",
	return: { a: null, b: [false, [123, "abc"]] }
};

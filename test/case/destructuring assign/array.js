module.exports = {
	environment: { a: undefined },
	program: "let [a] = [0, 1];",
	effect: { a: 0 }
};

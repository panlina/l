module.exports = {
	environment: { a: [], b: undefined, c: undefined },
	program: "var d; let d = [0, {1, 2}]; let [a@0, {b, c}] = d;",
	effect: { a: [0], b: 1, c: 2 }
};

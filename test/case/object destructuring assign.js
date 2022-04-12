module.exports = {
	environment: { a: [], b: undefined, c: undefined },
	program: "var d; let d = { a: 0, bc: { b: 1, c: 2 }}; let { a: a@0, bc: { b: b, c: c }} = d;",
	effect: { a: [0], b: 1, c: 2 }
};

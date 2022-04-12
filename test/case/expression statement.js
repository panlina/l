module.exports = {
	environment: { a: 1 },
	program: "var reset; let reset = (_ => (let a = 0;)); reset 0;",
	effect: { a: 0 }
};

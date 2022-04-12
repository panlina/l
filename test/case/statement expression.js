module.exports = {
	environment: { a: 0, b: undefined, c: undefined, d: undefined },
	program: "let d = (a ? (let b = 0; let c = 1; let return = 0;) : (let b = 1; let c = 0; let return = 1;));",
	effect: { a: 0, b: 1, c: 0, d: 1 }
};

module.exports = {
	environment: {},
	program: "var p; let p = []; let p@0={x:0,y:0}; let p@0.x=1; var x; let x = p@0.x; let return = x;",
	return: 1
};

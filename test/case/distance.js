module.exports = {
	environment: { sqrt: Math.sqrt },
	program: "var p; let p = [{x:1,y:0},{x:2,y:2}]; var d; let d = sqrt ((p@0.x - p@1.x) * (p@0.x - p@1.x) + (p@0.y - p@1.y) * (p@0.y - p@1.y)); let return = d;",
	return: Math.sqrt(5)
};

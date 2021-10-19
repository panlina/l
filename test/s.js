var t = require("@babel/types");
var i = {
	expression: {
		undefined: expression => t.unaryExpression("void", t.numericLiteral(0))
	}
};
module.exports = i;

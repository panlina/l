var Scope = require('../Scope');
var Environment = require('../Environment');
module.exports = new Environment(
	new Scope({
		undefined: undefined,
		null: null,
		false: false,
		true: true
	})
);

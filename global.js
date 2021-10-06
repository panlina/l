var Environment = require('./Environment');
var Scope = require('./Scope');
module.exports = new Environment(
	new Scope({
		undefined: 'variable',
		null: 'variable',
		false: 'variable',
		true: 'variable'
	})
);

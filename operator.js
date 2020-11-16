var operator = [
	{ name: '+', left: false, right: true, precedence: 0 },
	{ name: '-', left: false, right: true, precedence: 0 },
	{ name: '*', left: true, right: true, precedence: 1 },
	{ name: '/', left: true, right: true, precedence: 1 },
	{ name: '+', left: true, right: true, precedence: 2 },
	{ name: '-', left: true, right: true, precedence: 2 }
];
var group = require('lodash.groupby')(operator, 'name');
Object.defineProperty(operator, 'resolve', {
	value: function (name, left, right) {
		return group[name].find(
			operator =>
				operator.left == left
				&&
				operator.right == right
		);
	}
});
module.exports = operator;

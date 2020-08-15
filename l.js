var parse = require('./parse');
var Expression = require('./Expression');
var Statement = require('./Statement');
var traverse = require('traverse');
function l(strings, ...expressions) {
	var s = "";
	for (var i = 0; i < expressions.length; i++)
		s += strings[i] + `%_${i}%`;
	s += strings[i];
	var s = parse(s);
	var s = { $: s };
	traverse(s).forEach(function (v) {
		if (v instanceof Expression.Placeholder)
			this.update(expressions[+v.name.substr(1)], true);
		if (v instanceof Statement.Placeholder)
			this.update(expressions[+v.name.substr(1)], true);
	});
	var { $: s } = s;
	return s;
}
module.exports = l;

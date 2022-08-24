var Expression = require('./Expression');
var Statement = require('./Statement');
var Label = require('./Label');
var traverse = require('./traverse');
function findReferences(name) {
	if (name.parent instanceof Statement && name.parent.type == 'var') {
		var _var = name.parent;
		var owner = _var.parent;
	} else if (name.parent instanceof Label) {
		var label = name.parent;
		var owner = label.parent;
	}
	var references = [];
	for (var child of traverse(owner))
		if (child instanceof Expression && child.type == 'name')
			if (child.definition == name)
				references.push(child);
	return references;
}
module.exports = findReferences;

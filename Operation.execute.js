// The Operation class is not exported by ohm,
// so create a dummy semantics, add a dummy operation and steal it.
var ohm = require('ohm-js');
var grammar = ohm.grammar("l{}");
var semantics = grammar.createSemantics();
semantics.addOperation('parse', {});
var Operation = semantics._getSemantics().operations.parse.constructor;
Operation.prototype.execute = (execute => function (semantics, nodeWrapper) {
	// copied from ohm-js/src/Semantics.js:Operation.execute
	const { ctorName } = nodeWrapper._node;
	let actionFn = this.actionDict[ctorName];
	var result = execute.apply(this, arguments);
	if (actionFn?.$isSyntax)
		Object.defineProperty(result, 'node', { value: nodeWrapper })
	return result;
})(Operation.prototype.execute);

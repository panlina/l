var assert = require('assert');
var l = require('../l');
var Environment = require('../Environment');
var Scope = require('../Scope');
var Machine = require('../Machine');
var Value = require('../Value');

describe('machine', function () {
	it('', function () {
		var machine = new Machine(new Environment(new Scope({ a: new Value.Undefined() })));
		machine.execute(l`let a=12;`[0]);
		assert(Value.equals(machine.evaluate(l`a`), new Value.Number(12)));
	});
	describe('error', function () {
		var RuntimeError = require('../RuntimeError');
		it('undefined name', function () {
			var machine = new Machine(new Environment(new Scope({ a: new Value.Undefined() })));
			assert.throws(() => {
				machine.execute(l`let a=b;`[0]);
			}, RuntimeError.UndefinedName);
		});
	});
});

var assert = require('assert');
var l = require('../l');
var Environment = require('../Environment');
var Scope = require('../Scope');
var Machine = require('../Machine');
var Value = require('../Value');

describe('machine', function () {
	it('', function () {
		var machine = new Machine(
			new Environment(new Scope({ a: new Value.Undefined() })),
			l`let a=12;let a=14;`
		);
		machine.step();
		assert(Value.equals(machine.evaluate(l`a`), new Value.Number(12)));
		machine.step();
		assert(Value.equals(machine.evaluate(l`a`), new Value.Number(14)));
	});
	describe('error', function () {
		var RuntimeError = require('../RuntimeError');
		it('undefined name', function () {
			var machine = new Machine(
				new Environment(new Scope({ a: new Value.Undefined() })),
				l``
			);
			assert.throws(() => {
				machine.execute(l`let a=b;`[0]);
			}, RuntimeError.UndefinedName);
		});
	});
});

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
	it('array', function () {
		var machine = new Machine(
			new Environment(new Scope({})),
			l``
		);
		var a = machine.evaluate(l`[12,26]`);
		assert(Value.equals(a.element[0], new Value.Number(12)));
		assert(Value.equals(a.element[1], new Value.Number(26)));
	});
	it('tuple', function () {
		var machine = new Machine(
			new Environment(new Scope({})),
			l``
		);
		var a = machine.evaluate(l`{12,26}`);
		assert(Value.equals(a.element[0], new Value.Number(12)));
		assert(Value.equals(a.element[1], new Value.Number(26)));
	});
	it('object', function () {
		var machine = new Machine(
			new Environment(new Scope({})),
			l``
		);
		var a = machine.evaluate(l`{a:12,b:26}`);
		assert(Value.equals(a.property['a'], new Value.Number(12)));
		assert(Value.equals(a.property['b'], new Value.Number(26)));
	});
	it('property', function () {
		var machine = new Machine(
			new Environment(new Scope({ object: new Value.Object({ a: new Value.Number(12), b: new Value.Number(26) }) })),
			l``
		);
		var a = machine.evaluate(l`object.a`);
		assert(Value.equals(a, new Value.Number(12)));
	});
	it('element', function () {
		var machine = new Machine(
			new Environment(new Scope({ array: new Value.Array([new Value.Number(12), new Value.Number(26)]) })),
			l``
		);
		var a = machine.evaluate(l`array@1`);
		assert(Value.equals(a, new Value.Number(26)));
	});
	it('operation', function () {
		var machine = new Machine(
			new Environment(new Scope({})),
			l``
		);
		assert(Value.equals(machine.evaluate(l`1+2`), new Value.Number(3)));
		assert(Value.equals(machine.evaluate(l`-1`), new Value.Number(-1)));
		assert(Value.equals(machine.evaluate(l`"a"+"bc"`), new Value.String("abc")));
		assert(Value.equals(machine.evaluate(l`12<=26`), new Value.Boolean(true)));
		assert(Value.equals(machine.evaluate(l`!#false`), new Value.Boolean(true)));
		assert(Value.equals(machine.evaluate(l`#false&#true`), new Value.Boolean(false)));
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

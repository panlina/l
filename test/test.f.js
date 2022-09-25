var assert = require('assert');
var parse = require('../parse');
var compile = require('../compile');
var Environment = require('../Environment');
var Scope = require('../Scope');

function test($case) {
	var i = require('./f');
	var l = $case.program;
	var l = parse(l);
	var f = compile(l, new Environment(new Scope(require('lodash.mapvalues')($case.environment, () => 'variable'))), i);
	var environment = new Environment(new Scope({ ...$case.environment }));
	var v = f(environment);
	if ('return' in $case)
		assert.deepStrictEqual(v, $case.return);
	if ('effect' in $case)
		assert.deepStrictEqual(environment.scope, new Scope($case.effect));
}

describe('compile', function () {
	it('', function () {
		var i = require('./f');
		var l = "var a; let a = length \"abc\"; var b; let b = a + 1; goto RETURN; let b = b + 1; RETURN: let return = b;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ length: 'variable' })), i);
		var environment = new Environment(new Scope({ length: s => s.length }));
		var v = f(environment);
		assert.equal(v, 4);
	});
	it('undefined', function () {
		test(require('./case/undefined'));
	});
	it('null', function () {
		test(require('./case/null'));
	});
	it('boolean', function () {
		test(require('./case/boolean'));
	});
	it('number', function () {
		test(require('./case/number'));
	});
	it('string', function () {
		test(require('./case/string'));
	});
	it('name', function () {
		test(require('./case/name'));
	});
	it('object', function () {
		test(require('./case/object'));
	});
	it('array', function () {
		test(require('./case/array'));
	});
	it('tuple', function () {
		test(require('./case/tuple'));
	});
	it('property', function () {
		test(require('./case/property'));
	});
	it('element', function () {
		test(require('./case/element'));
	});
	it('call', function () {
		test(require('./case/call'));
	});
	it('operation', function () {
		test(require('./case/operation'));
	});
	it('conditional', function () {
		test(require('./case/conditional'));
	});
	it('statement expression', function () {
		test(require('./case/statement expression'));
	});
	it('function', function () {
		test(require('./case/function'));
	});
	it('higher order function', function () {
		test(require('./case/higher order function'));
	});
	describe('assign', function () {
		it('name', function () {
			test(require('./case/assign/name'));
		});
		it('element', function () {
			test(require('./case/assign/element'));
		});
		it('property', function () {
			test(require('./case/assign/property'));
		});
	});
	describe('destructuring assign', function () {
		it('array', function () {
			test(require('./case/destructuring assign/array'));
		});
		it('tuple', function () {
			test(require('./case/destructuring assign/tuple'));
		});
		it('object', function () {
			test(require('./case/destructuring assign/object'));
		});
		it('object nested', function () {
			test(require('./case/destructuring assign/object nested'));
		});
	});
	it('function argument destructuring', function () {
		test(require('./case/function argument destructuring'));
	});
	it('block', function () {
		test(require('./case/block'));
	});
	it('goto', function () {
		test(require('./case/goto'));
	});
	it('expression statement', function () {
		test(require('./case/expression statement'));
	});
	it('while', function () {
		test(require('./case/while'));
	});
	it('break', function () {
		test(require('./case/break'));
	});
	it('distance', function () {
		test(require('./case/distance'));
	});
	it('factorial', function () {
		test(require('./case/factorial'));
	});
	it('y combinator', function () {
		test(require('./case/y combinator'));
	});
	it('sum', function () {
		test(require('./case/sum'));
	});
	it('scope', function () {
		test(require('./case/scope'));
	});
	describe('error', function () {
		var Error = require('../Error');
		it('undefined name', function () {
			var i = require('./f');
			var l = "a";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, Error.UndefinedName);
		});
		it('undefined label', function () {
			var i = require('./f');
			var l = "goto L;";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, Error.UndefinedName);
		});
		it('variable name expected', function () {
			var i = require('./f');
			var l = "L: var a; let a = L;";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, Error.VariableNameExpected);
		});
		it('label name expected', function () {
			var i = require('./f');
			var l = "var a; goto a;";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, Error.LabelNameExpected);
		});
		it('break outside while', function () {
			var i = require('./f');
			var l = "break;";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, Error.BreakOutsideWhile);
		});
		it('invalid assignment', function () {
			var i = require('./f');
			var l = "var a; let a + 1 = 0;";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, Error.InvalidAssignment);
		});
		it('invalid function parameter', function () {
			var i = require('./f');
			var l = "f x => x";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, Error.InvalidFunctionParameter);
		});
	});
});

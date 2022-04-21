var g = require("@babel/generator").default;
var assert = require('assert');
var vm = require('vm');
var parse = require('../parse');
var compile = require('../compile');
var Environment = require('../Environment');
var Scope = require('../Scope');

function test($case) {
	var i = require('./s');
	var l = $case.program;
	var l = parse(l);
	var s = compile(l, new Environment(new Scope(require('lodash.mapvalues')($case.environment, () => 'variable'))), i);
	var context = $case.environment;
	vm.createContext(context);
	var v = vm.runInContext(`(${g(s).code})`, context);
	if ('return' in $case)
		assert.deepEqual(v, $case.return);
	if ('effect' in $case)
		assert.deepEqual(context, $case.effect);
}

describe('compile.s', function () {
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
	it('array, tuple destructuring assign', function () {
		test(require('./case/array, tuple destructuring assign'));
	});
	it('object destructuring assign', function () {
		test(require('./case/object destructuring assign'));
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
});

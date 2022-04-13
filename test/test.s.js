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
	it('', function () {
		test(require('./case/value'));
	});
	it('property, element', function () {
		test(require('./case/property, element'));
	});
	it('call, operation', function () {
		test(require('./case/call, operation'));
	});
	it('conditional', function () {
		test(require('./case/conditional'));
	});
	it('function', function () {
		var i = require('./s');
		var l = "n => n + 1";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({})), i);
		var v = vm.runInContext(`(${g(s).code})`, vm.createContext());
		assert.deepEqual(v(0), 1);
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
	it('goto', function () {
		test(require('./case/goto'));
	});
	it('program', function () {
		test(require('./case/program'));
	});
});

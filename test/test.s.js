var g = require("@babel/generator").default;
var assert = require('assert');
var vm = require('vm');
var parse = require('../parse');
var compile = require('../compile');
var Environment = require('../Environment');
var Scope = require('../Scope');

describe('compile.s', function () {
	it('', function () {
		var i = require('./s');
		var l = "{ a: #null, b: [#false, {123, \"abc\"}] }";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({})), i);
		var v = vm.runInContext(`(${g(s).code})`, vm.createContext());
		assert.deepEqual(v, { a: null, b: [false, [123, "abc"]] });
	});
	it('property, element', function () {
		var i = require('./s');
		var l = "[0, { a: 1 }]@1.a";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({})), i);
		var v = vm.runInContext(`(${g(s).code})`, vm.createContext());
		assert.equal(v, 1);
	});
	it('call, operation', function () {
		var i = require('./s');
		var l = "parseInt \"1\" + parseInt \"2\"";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({ parseInt: 'variable' })), i);
		var v = vm.runInContext(`(${g(s).code})`, vm.createContext());
		assert.equal(v, 3);
	});
	it('conditional', function () {
		var i = require('./s');
		var l = "#true ? 1 : 0";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({})), i);
		var v = vm.runInContext(`(${g(s).code})`, vm.createContext());
		assert.equal(v, 1);
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
			var i = require('./s');
			var l = "let a = 1;";
			var l = parse(l, 'Statement');
			var s = compile(l, new Environment(new Scope({ a: 'variable' })), i);
			var context = { a: 0 };
			vm.createContext(context);
			vm.runInContext(g(s).code, context);
			assert.deepEqual(context, { a: 1 });
		});
		it('element', function () {
			var i = require('./s');
			var l = "let a@1 = 1;";
			var l = parse(l, 'Statement');
			var s = compile(l, new Environment(new Scope({ a: 'variable' })), i);
			var context = { a: [, 0] };
			vm.createContext(context);
			vm.runInContext(g(s).code, context);
			assert.deepEqual(context, { a: [, 1] });
		});
		it('property', function () {
			var i = require('./s');
			var l = "let a.b = 1;";
			var l = parse(l, 'Statement');
			var s = compile(l, new Environment(new Scope({ a: 'variable' })), i);
			var context = { a: { b: 0 } };
			vm.createContext(context);
			vm.runInContext(g(s).code, context);
			assert.deepEqual(context, { a: { b: 1 } });
		});
	});
	it('goto', function () {
		var i = require('./s');
		var l = "goto L; let a = a + 1; L: let a = a + 2;";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({ a: 'variable' })), i);
		var context = { a: 0 };
		vm.createContext(context);
		vm.runInContext(g(s).code, context);
		assert.deepEqual(context, { a: 2 });
	});
	it('program', function () {
		var i = require('./s');
		var l = "let a = 1; var b; let b = a + 1; let a = b;";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({ a: 'variable' })), i);
		var context = { a: 0 };
		vm.createContext(context);
		vm.runInContext(g(s).code, context);
		assert.deepEqual(context, { a: 2 });
	});
});

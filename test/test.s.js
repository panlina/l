var g = require("@babel/generator").default;
var assert = require('assert');
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
		var v = eval(`(${g(s).code})`);
		assert.deepEqual(v, { a: null, b: [false, [123, "abc"]] });
	});
	it('property, element', function () {
		var i = require('./s');
		var l = "[0, { a: 1 }]@1.a";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({})), i);
		var v = eval(g(s).code);
		assert.equal(v, 1);
	});
	it('call, operation', function () {
		var i = require('./s');
		var l = "parseInt \"1\" + parseInt \"2\"";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({ parseInt: 'variable' })), i);
		var v = eval(g(s).code);
		assert.equal(v, 3);
	});
	it('conditional', function () {
		var i = require('./s');
		var l = "#true ? 1 : 0";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({})), i);
		var v = eval(g(s).code);
		assert.equal(v, 1);
	});
	describe('assign', function () {
		it('name', function () {
			var i = require('./s');
			var l = "let a = 1;";
			var l = parse(l, 'Statement');
			var s = compile(l, new Environment(new Scope({ a: 'variable' })), i);
			assert.equal(g(s).code, "(function () {\n  a = 1;\n})()");
		});
		it('element', function () {
			var i = require('./s');
			var l = "let a@1 = 1;";
			var l = parse(l, 'Statement');
			var s = compile(l, new Environment(new Scope({ a: 'variable' })), i);
			assert.equal(g(s).code, "(function () {\n  a[1] = 1;\n})()");
		});
		it('property', function () {
			var i = require('./s');
			var l = "let a.b = 1;";
			var l = parse(l, 'Statement');
			var s = compile(l, new Environment(new Scope({ a: 'variable' })), i);
			assert.equal(g(s).code, "(function () {\n  a.b = 1;\n})()");
		});
	});
	it('program', function () {
		var i = require('./s');
		var l = "let a = 1;";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({ a: 'variable' })), i);
		var a = 0;
		eval(g(s).code);
		assert.equal(a, 1);
	});
});

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
});

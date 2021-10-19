var g = require("@babel/generator").default;
var assert = require('assert');
var parse = require('../parse');
var compile = require('../compile');
var Environment = require('../Environment');
var Scope = require('../Scope');

describe('compile.s', function () {
	it('', function () {
		var i = require('./s');
		var l = "#undefined";
		var l = parse(l);
		var s = compile(l, new Environment(new Scope({})), i);
		var v = eval(g(s).code);
		assert.equal(v, undefined);
	});
});

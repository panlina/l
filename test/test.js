var assert = require('assert');
var parse = require('../parse');
var compile = require('../compile');
var generate = require('../generate');

describe('parse, generate', function () {
	it('expression', function () {
		var source = "pred succ 12";
		var syntax = parse(source);
		assert.equal(generate(syntax), source);
	});
	it('statement', function () {
		var source = "a=12;b=26;";
		var syntax = parse(source);
		assert.equal(generate(syntax), source);
	});
});

it("placeholder", function () {
	var l = parse("f %x%");
	assert.equal(generate(l), "f %x%");
});

describe('compile', function () {
	it('', function () {
		var i = require('./f');
		var l = "a = succ 12; b = succ a;";
		var l = parse(l);
		var f = compile(l, i);
		var environment = { succ: n => n + 1 };
		f(environment);
		assert.equal(environment.a, 13);
		assert.equal(environment.b, 14);
	})
});

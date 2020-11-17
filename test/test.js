var assert = require('assert');
var parse = require('../parse');
var compile = require('../compile');
var generate = require('../generate');
var l = require('../l');

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
	it("precedence", function () {
		var source = "f [0,1]@1+1?1:0";
		var syntax = parse(source);
		assert.equal(generate(syntax), source);
	});
});

it("placeholder", function () {
	var l = parse("f %x%");
	assert.equal(generate(l), "f %x%");
	var l = parse("x=0;%y%");
	assert.equal(generate(l), "x=0;%y%");
});

it("quasiquote", function () {
	var x = l`x`;
	var fx = l`f ${x}`;
	var fx = l`${fx}`;
	var y_fx = l`y=${fx};`;
	var p = l`${y_fx}z=y;`;
	var p = l`${p}`;
	assert.equal(generate(p), "y=f x;z=y;");
});

describe('compile', function () {
	it('', function () {
		var i = require('./f');
		var l = "a = length \"abc\"; b = a + 1;";
		var l = parse(l);
		var f = compile(l, i);
		var environment = { succ: n => n + 1, length: s => s.length };
		f(environment);
		assert.equal(environment.a, 3);
		assert.equal(environment.b, 4);
	});
	it('distance', function () {
		var i = require('./f');
		var l = "p = [{x:1,y:0},{x:2,y:2}]; d = sqrt ((p@0.x - p@1.x) * (p@0.x - p@1.x) + (p@0.y - p@1.y) * (p@0.y - p@1.y));";
		var l = parse(l);
		var f = compile(l, i);
		var environment = { sqrt: Math.sqrt };
		f(environment);
		assert.equal(environment.d, Math.sqrt(5));
	});
});

var assert = require('assert');
var parse = require('../parse');
var compile = require('../compile');
var generate = require('../generate');
var l = require('../l');
var Environment = require('../Environment');
var Scope = require('../Scope');

describe('parse, generate', function () {
	it('expression', function () {
		var source = "pred succ 12";
		var syntax = parse(source);
		assert.equal(generate(syntax), source);
	});
	it('statement', function () {
		var source = "let a=12;let b=26;";
		var syntax = parse(source);
		assert.equal(generate(syntax), source);
	});
	it("precedence", function () {
		var source = "!f [0,1]@1+1|1&0?1:0";
		var syntax = parse(source);
		assert.equal(generate(syntax), source);
	});
});

it("placeholder", function () {
	var l = parse("f %x%");
	assert.equal(generate(l), "f %x%");
	var l = parse("let x=0;%y%");
	assert.equal(generate(l), "let x=0;%y%");
});

it("quasiquote", function () {
	var x = l`x`;
	var fx = l`f ${x}`;
	var fx = l`${fx}`;
	var y_fx = l`let y=${fx};`;
	var p = l`${y_fx}let z=y;`;
	var p = l`${p}`;
	assert.equal(generate(p), "let y=f x;let z=y;");
});

describe('compile', function () {
	it('', function () {
		var i = require('./f');
		var l = "var a; let a = length \"abc\"; var b; let b = a + 1;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ length: null })), i);
		var environment = new Environment(new Scope({ length: s => s.length }));
		f(environment);
		assert.equal(environment.scope.a, 3);
		assert.equal(environment.scope.b, 4);
	});
	it('distance', function () {
		var i = require('./f');
		var l = "var p; let p = [{x:1,y:0},{x:2,y:2}]; var d; let d = sqrt ((p@0.x - p@1.x) * (p@0.x - p@1.x) + (p@0.y - p@1.y) * (p@0.y - p@1.y));";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ sqrt: null })), i);
		var environment = new Environment(new Scope({ sqrt: Math.sqrt }));
		f(environment);
		assert.equal(environment.scope.d, Math.sqrt(5));
	});
	it('assign', function () {
		var i = require('./f');
		var l = "var p; let p = []; let p@0={x:0,y:0}; let p@0.x=1; var x; let x = p@0.x;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({})), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.x, 1);
	});
	it('scope', function () {
		var i = require('./f');
		var l = "var a; let a = 0; { var a; let a = 1; }";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({})), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.a, 0);
	});
	it('expression statement', function () {
		var i = require('./f');
		var l = "var a; let a = 1; reset 0;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ reset: null })), i);
		var environment = new Environment(new Scope({
			reset: () => {
				for (var name in environment.scope)
					delete environment.scope[name];
			}
		}));
		f(environment);
		assert.deepEqual(environment.scope, {});
	});
	it('statement expression', function () {
		var i = require('./f');
		var l = "var b; var c; var d; let d = (a ? (let b = 0; let c = 1; let return = 0;) : (let b = 1; let c = 0; let return = 1;));";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ a: null })), i);
		var environment = new Environment(new Scope({ a: 0 }));
		f(environment);
		assert.equal(environment.scope.b, 1);
		assert.equal(environment.scope.c, 0);
		assert.equal(environment.scope.d, 1);
	});
	it('function expression', function () {
		var i = require('./f');
		var l = "var f; let f = (=> (var a; let a = argument; let return = (=> argument + argument + a);)); var g; let g = f 1; var x; let x = g 2;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({})), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.x, 5);
	});
	describe('error', function () {
		var CompileError = require('../CompileError');
		it('undefined name', function () {
			var i = require('./f');
			var l = "a";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, CompileError.UndefinedName);
		});
	});
});

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
		var source = "L:var a;let a=12;{var b;let b=26;f b;}goto L;";
		var syntax = parse(source);
		assert.equal(generate(syntax), source);
	});
	it("precedence", function () {
		var source = "x=>!f [0,1]@1+1|1&0?#true:#false";
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
		var l = "var a; let a = length \"abc\"; var b; let b = a + 1; goto RETURN; let b = b + 1; RETURN: let return = b;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ length: 'variable', return: 'variable' })), i);
		var environment = new Environment(new Scope({ length: s => s.length }));
		f(environment);
		assert.equal(environment.scope.return, 4);
	});
	it('distance', function () {
		var i = require('./f');
		var l = "var p; let p = [{x:1,y:0},{x:2,y:2}]; var d; let d = sqrt ((p@0.x - p@1.x) * (p@0.x - p@1.x) + (p@0.y - p@1.y) * (p@0.y - p@1.y)); let return = d;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ sqrt: 'variable', return: 'variable' })), i);
		var environment = new Environment(new Scope({ sqrt: Math.sqrt }));
		f(environment);
		assert.equal(environment.scope.return, Math.sqrt(5));
	});
	it('assign', function () {
		var i = require('./f');
		var l = "var p; let p = []; let p@0={x:0,y:0}; let p@0.x=1; var x; let x = p@0.x; let return = x;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ return: 'variable' })), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.return, 1);
	});
	it('array/tuple destructuring assign', function () {
		var i = require('./f');
		var l = "let d = [0, {1, 2}]; let [a@0, {b, c}] = d;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ a: 'variable', b: 'variable', c: 'variable', d: 'variable' })), i);
		var environment = new Environment(new Scope({ a: [] }));
		f(environment);
		assert.equal(environment.scope.a[0], 0);
		assert.equal(environment.scope.b, 1);
		assert.equal(environment.scope.c, 2);
	});
	it('object destructuring assign', function () {
		var i = require('./f');
		var l = "let d = { a: 0, bc: { b: 1, c: 2 }}; let { a: a@0, bc: { b: b, c: c }} = d;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ a: 'variable', b: 'variable', c: 'variable', d: 'variable' })), i);
		var environment = new Environment(new Scope({ a: [] }));
		f(environment);
		assert.equal(environment.scope.a[0], 0);
		assert.equal(environment.scope.b, 1);
		assert.equal(environment.scope.c, 2);
	});
	it('function argument destructuring', function () {
		var i = require('./f');
		var l = "var f; let f = ([a, { b: b, c: c }] => a + b * c); let return = f [1, { b: 2, c: 3 }];";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ return: 'variable' })), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.return, 7);
	});
	it('scope', function () {
		var i = require('./f');
		var l = "var a; let a = 0; { var a; let a = 1; } let return = a;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ return: 'variable' })), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.return, 0);
	});
	it('expression statement', function () {
		var i = require('./f');
		var l = "reset 0;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ a: 'variable', reset: 'variable' })), i);
		var environment = new Environment(new Scope({
			a: 1,
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
		var l = "let d = (a ? (let b = 0; let c = 1; let return = 0;) : (let b = 1; let c = 0; let return = 1;));";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ a: 'variable', b: 'variable', c: 'variable', d: 'variable' })), i);
		var environment = new Environment(new Scope({ a: 0 }));
		f(environment);
		assert.equal(environment.scope.b, 1);
		assert.equal(environment.scope.c, 0);
		assert.equal(environment.scope.d, 1);
	});
	it('function expression', function () {
		var i = require('./f');
		var l = "var f; let f = (a => (b => b + b + a)); var g; let g = f 1; let return = g 2;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ return: 'variable' })), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.return, 5);
	});
	it('factorial', function () {
		var i = require('./f');
		var l = "var f; let f = (n => n > 1 ? n * f (n - 1) : 1); let return = f 4;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ return: 'variable' })), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.return, 24);
	});
	it('y combinator', function () {
		var i = require('./f');
		var l = `
			var y; let y = (f => (x => x x) (x => f (y => (x x) y)));
			var f; let f = y (f => (n => n > 1 ? n * f (n - 1) : 1));
			let return = f 4;
		`;
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ return: 'variable' })), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.return, 24);
	});
	it('while', function () {
		var i = require('./f');
		var l = `
			var n;
			let n = 10;
			while n > 4 do
				let n = n - 1;
			let return = n;
		`;
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ return: 'variable' })), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.return, 4);
	});
	it('break', function () {
		var i = require('./f');
		var l = `
			var n;
			let n = 10;
			while #true do {
				n = 4 ? (break;) : 0;
				let n = n - 1;
			}
			let return = n;
		`;
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ return: 'variable' })), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.return, 4);
	});
	it('sum', function () {
		var i = require('./f');
		var l = `
			var s;
			let s = 0;
			var n;
			let n = 1;
			while n <= 10 do {
				let s = s + n;
				let n = n + 1;
			}
			let return = s;
		`;
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ return: 'variable' })), i);
		var environment = new Environment(new Scope({}));
		f(environment);
		assert.equal(environment.scope.return, 55);
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
		it('undefined label', function () {
			var i = require('./f');
			var l = "goto L;";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, CompileError.UndefinedLabel);
		});
		it('break outside while', function () {
			var i = require('./f');
			var l = "break;";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, CompileError.BreakOutsideWhile);
		});
		it('invalid assignment', function () {
			var i = require('./f');
			var l = "var a; let a + 1 = 0;";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, CompileError.InvalidAssignment);
		});
		it('invalid function parameter', function () {
			var i = require('./f');
			var l = "f x => x";
			var l = parse(l);
			assert.throws(() => {
				var f = compile(l, new Environment(new Scope({})), i);
			}, CompileError.InvalidFunctionParameter);
		});
	});
});

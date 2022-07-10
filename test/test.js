var assert = require('assert');
var parse = require('../parse');
var compile = require('../compile');
var generate = require('../generate');
var l = require('../l');
var Environment = require('../Environment');
var Scope = require('../Scope');

describe('parse, generate', function () {
	it('expression', function () {
		var source = "pred (L:succ 12)";
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

var programAt = require('../programAt');
describe('programAt', function () {
	it('', function () {
		var source = "let b = { a: 123 };";
		var syntax = parse(source);
		var p = programAt(syntax, 13);
		assert.equal(p.nodeWrapper.source.startIdx, 13);
		assert.equal(p.nodeWrapper.source.endIdx, 16);
	});
});

function test($case) {
	var i = require('./f');
	var l = $case.program;
	var l = parse(l);
	var f = compile(l, new Environment(new Scope(require('lodash.mapvalues')($case.environment, () => 'variable'))), i);
	var environment = new Environment(new Scope($case.environment));
	var v = f(environment);
	if ('return' in $case)
		assert.deepEqual(v, $case.return);
	if ('effect' in $case)
		assert.deepEqual(environment.scope, $case.effect);
}

describe('compile', function () {
	it('', function () {
		var i = require('./f');
		var l = "var a; let a = length \"abc\"; var b; let b = a + 1; goto RETURN; let b = b + 1; RETURN: let return = b;";
		var l = parse(l);
		var f = compile(l, new Environment(new Scope({ length: 'variable' })), i);
		var environment = new Environment(new Scope({ length: s => s.length }));
		var v = f(environment);
		assert.equal(v, 4);
	});
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
	describe('destructuring assign', function () {
		it('array', function () {
			test(require('./case/destructuring assign/array'));
		});
		it('tuple', function () {
			test(require('./case/destructuring assign/tuple'));
		});
		it('object', function () {
			test(require('./case/destructuring assign/object'));
		});
		it('object nested', function () {
			test(require('./case/destructuring assign/object nested'));
		});
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

var analyze = require('../analyze');
describe('analyze', function () {
	it('', function () {
		var b = l`b`;
		var program = l`var a;{var b;let [${b}]=a;}`;
		analyze(program, new Environment(new Scope({})));
		assert.deepEqual(b.environment, new Environment(
			new Scope({ b: 'variable' }),
			new Environment(
				new Scope({ a: 'variable', return: 'variable' }),
				new Environment(new Scope({}))
			)
		));
	});
	it('function', function () {
		var [statement] = l`let b=a;`;
		var program = l`[a]=>(var b;${statement})`;
		analyze(program, new Environment(new Scope({})));
		assert.deepEqual(statement.environment, new Environment(
			new Scope({ b: 'variable', return: 'variable' }),
			new Environment(
				new Scope({ a: 'variable', return: 'variable' }),
				new Environment(new Scope({}))
			)
		));
	});
});

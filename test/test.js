var assert = require('assert');
var shallowequal = require("shallowequal");
var parse = require('../parse');
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
		assert.equal(p.node.source.startIdx, 13);
		assert.equal(p.node.source.endIdx, 16);
	});
});

var analyze = require('../analyze');
var findReferences = require('../findReferences');
describe('analyze', function () {
	it('', function () {
		var b = l`b`;
		var program = l`var a;{var b;let [${b}]=a;}`;
		analyze(program, new Environment(new Scope({})));
		assert.deepStrictEqual(b.environment, new Environment(
			new Scope({ b: 'variable' }),
			new Environment(
				new Scope({ a: 'variable', return: 'variable' }),
				new Environment(new Scope({}))
			)
		));
		assert.equal(b.definition, program[1].statement[0].name);
		assert(shallowequal(findReferences(program[0].name), [b.parent.parent.right]));
		assert.equal(b.parent, program[1].statement[1].left);
	});
	it('function', function () {
		var [statement] = l`let b=a;`;
		var program = l`[a]=>(var b;${statement})`;
		analyze(program, new Environment(new Scope({})));
		assert.deepStrictEqual(statement.environment, new Environment(
			new Scope({ b: 'variable', return: 'variable' }),
			new Environment(
				new Scope({ a: 'variable', return: 'variable' }),
				new Environment(new Scope({}))
			)
		));
		assert.equal(statement.right.definition, program.argument.element[0]);
		assert(shallowequal(findReferences(program.argument.element[0]), [statement.right]));
		assert.equal(statement.parent, program.expression);
	});
	it('label', function () {
		var program = l`L: goto L;`;
		var [label, goto] = program;
		analyze(program, new Environment(new Scope({})));
		assert.deepStrictEqual(goto.label.environment, new Environment(
			new Scope({ L: 'label', return: 'variable' }),
			new Environment(new Scope({}))
		));
		assert.equal(goto.label.definition, label.name);
		assert(shallowequal(findReferences(label.name), [goto.label]));
		assert.equal(goto.parent, program);
	});
	describe('error', function () {
		var CompileError = require('../CompileError');
		it('undefined name', function () {
			var l = "a";
			var l = parse(l);
			analyze(l, new Environment(new Scope({})));
			assert(l.error instanceof CompileError.UndefinedName);
		});
		it('undefined label', function () {
			var l = "goto L;";
			var l = parse(l);
			analyze(l, new Environment(new Scope({})));
			assert(l[0].label.error instanceof CompileError.UndefinedName);
		});
		it('variable name expected', function () {
			var l = "L: var a; let a = L;";
			var l = parse(l);
			analyze(l, new Environment(new Scope({})));
			assert(l[2].right.error instanceof CompileError.VariableNameExpected);
		});
		it('label name expected', function () {
			var l = "var a; goto a;";
			var l = parse(l);
			analyze(l, new Environment(new Scope({})));
			assert(l[1].label.error instanceof CompileError.LabelNameExpected);
		});
		it('break outside while', function () {
			var l = "break;";
			var l = parse(l);
			analyze(l, new Environment(new Scope({})));
			assert(l[0].error instanceof CompileError.BreakOutsideWhile);
		});
		it('invalid assignment', function () {
			var l = "var a; let a + 1 = 0;";
			var l = parse(l);
			analyze(l, new Environment(new Scope({})));
			assert(l[1].error instanceof CompileError.InvalidAssignment);
		});
		it('invalid function parameter', function () {
			var l = "f x => x";
			var l = parse(l);
			analyze(l, new Environment(new Scope({})));
			assert(l.error instanceof CompileError.InvalidFunctionParameter);
		});
	});
});

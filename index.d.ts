import l = require('./l');
export = l;
import parse = require('./parse');
import programAt = require('./programAt');
import compile = require('./compile');
import analyze = require('./analyze');
import generate = require('./generate');
import Expression = require('./Expression');
import Statement = require('./Statement');
import Scope = require('./Scope');
import Environment = require('./Environment');
import Interpretation = require('./Interpretation');
declare namespace l {
	export {
		parse,
		programAt,
		compile,
		analyze,
		generate,
		Expression,
		Statement,
		Scope,
		Environment,
		Interpretation
	}
}

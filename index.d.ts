import l = require('./l');
export = l;
import parse = require('./parse');
import children = require('./children');
import traverse = require('./traverse');
import programAt = require('./programAt');
import compile = require('./compile');
import analyze = require('./analyze');
import findReferences = require('./findReferences');
import generate = require('./generate');
import Expression = require('./Expression');
import Statement = require('./Statement');
import Label = require('./Label');
import Program = require('./Program');
import Scope = require('./Scope');
import Environment = require('./Environment');
import Interpretation = require('./Interpretation');
import ParseError = require('./ParseError');
import Error = require('./Error');
import Annotated = require('./Annotated');
import AnalyzedScope = require('./AnalyzedScope');
import Machine = require('./Machine');
import Value = require('./Value');
declare namespace l {
	export {
		parse,
		children,
		traverse,
		programAt,
		compile,
		analyze,
		findReferences,
		generate,
		Expression,
		Statement,
		Label,
		Program,
		Scope,
		Environment,
		Interpretation,
		ParseError,
		Error,
		Annotated,
		AnalyzedScope,
		Machine,
		Value
	}
}

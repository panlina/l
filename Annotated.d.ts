import { Node } from "ohm-js";
import Environment = require("./Environment");
import Expression = require('./Expression');
import Statement = require('./Statement');
import CompileError = require('./CompileError');

type Annotated<T extends Expression | Statement> = T & {
	environment: Environment<'variable' | 'label'>;
	error: CompileError;
	nodeWrapper: Node;
}

export = Annotated;

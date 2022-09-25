import { Node } from "ohm-js";
import Environment = require("./Environment");
import Expression = require('./Expression');
import Program = require('./Program');
import Statement = require('./Statement');
import Error = require('./Error');

type Annotated<T extends Expression | Statement> = T & {
	environment: Environment<'variable' | 'label'>;
	parent: Program | undefined;
	error: Error;
	node: Node;
	definition?: Expression.Name;
}

export = Annotated;

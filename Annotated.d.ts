import { Node } from "ohm-js";
import Environment = require("./Environment");
import Expression = require('./Expression');
import Statement = require('./Statement');

type Annotated<T extends Expression | Statement> = T & {
	environment: Environment<'variable' | 'label'>;
	nodeWrapper: Node;
}

export = Annotated;

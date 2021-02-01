import * as Expression from './Expression';
import * as Statement from './Statement';
import * as Environment from './Environment';
import * as Interpretation from './Interpretation';
declare function compile<T>(
	expression: Expression | Statement,
	environment: Environment,
	interpretation: Interpretation<T>
): T;
export = compile;

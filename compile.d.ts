import * as Expression from './Expression';
import * as Statement from './Statement';
import * as Interpretation from './Interpretation';
function compile<T>(
	expression: Expression | Statement,
	interpretation: Interpretation<T>
): T;
export = compile;

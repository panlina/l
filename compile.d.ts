import * as Expression from './Expression';
import * as Statement from './Statement';
import * as Environment from './Environment';
import * as Interpretation from './Interpretation';
declare function compile<T>(
	program: Expression | Statement[],
	environment: Environment<'variable' | 'label'>,
	interpretation: Interpretation<T>
): T;
export = compile;

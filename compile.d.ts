import Expression = require('./Expression');
import Statement = require('./Statement');
import Environment = require('./Environment');
import Interpretation = require('./Interpretation');
declare function compile<T>(
	program: Expression | Statement[],
	environment: Environment<'variable' | 'label'>,
	interpretation: Interpretation<T>
): T;
export = compile;

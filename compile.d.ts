import Program = require('./Program');
import Environment = require('./Environment');
import Interpretation = require('./Interpretation');
declare function compile<T>(
	program: Program,
	environment: Environment<'variable' | 'label'>,
	interpretation: Interpretation<T>
): T;
export = compile;

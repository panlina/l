import Expression = require('./Expression');
import Error = require('./Error');
declare function extractFunctionArgumentNames(argument: Expression): Generator<Expression.Name | Error.InvalidFunctionParameter>;
export = extractFunctionArgumentNames;

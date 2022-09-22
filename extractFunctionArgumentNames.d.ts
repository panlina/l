import Expression = require('./Expression');
declare function extractFunctionArgumentNames(argument: Expression): Generator<Expression.Name>;
export = extractFunctionArgumentNames;

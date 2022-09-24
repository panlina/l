import Expression = require('./Expression');
import CompileError = require('./CompileError');
declare function extractFunctionArgumentNames(argument: Expression): Generator<Expression.Name | CompileError.InvalidFunctionParameter>;
export = extractFunctionArgumentNames;

import Expression = require('./Expression');
import Statement = require('./Statement');
import Label = require('./Label');
declare function traverse(program: Expression | (Statement | Label)[] | Statement | Label): Generator<Expression | (Statement | Label)[] | Statement | Label>;
export = traverse;

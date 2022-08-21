import Expression = require('./Expression');
import Statement = require('./Statement');
import Label = require('./Label');
declare function traverse(program: Expression | Statement[] | Statement | Label): Generator<Expression | Statement[] | Statement | Label>;
export = traverse;

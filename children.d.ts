import Expression = require('./Expression');
import Statement = require('./Statement');
import Label = require('./Label');
declare function children(program: Expression | (Statement | Label)[] | Statement | Label): (Expression | (Statement | Label)[] | Statement | Label)[];
export = children;

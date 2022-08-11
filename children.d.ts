import Expression = require('./Expression');
import Statement = require('./Statement');
import Label = require('./Label');
declare function children(program: Expression | Statement[] | Statement | Label): (Expression | Statement[] | Statement | Label)[];
export = children;

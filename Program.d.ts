import Expression = require('./Expression');
import Statement = require('./Statement');
type Program = Expression | (Statement | Statement.Label)[];
export = Program;

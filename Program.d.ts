import Expression = require('./Expression');
import Statement = require('./Statement');
import Label = require('./Label');
type Program = Expression | (Statement | Label)[];
export = Program;

import Expression = require('./Expression');
import Statement = require('./Statement');
import Label = require('./Label');
declare function generate(program: Expression | Statement | (Statement | Label)[]): string;
export = generate;

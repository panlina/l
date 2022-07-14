import Expression = require('./Expression');
import Statement = require('./Statement');
declare function generate(program: Expression | Statement | Statement[]): string;
export = generate;

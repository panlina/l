import Expression = require('./Expression');
import Statement = require('./Statement');
declare function programAt(program: Expression | Statement[], position: number): Expression | Statement;
export = programAt;

import Expression = require('./Expression');
import Statement = require('./Statement');
import Program = require('./Program');
declare function programAt(program: Program, position: number): Expression | Statement;
export = programAt;

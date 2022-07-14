import Expression = require('./Expression');
import Statement = require('./Statement');
declare function parse(text: string, startRule?: string): Expression | Statement[];
export = parse;

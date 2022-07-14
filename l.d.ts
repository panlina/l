import Expression = require("./Expression");
import Statement = require("./Statement");
declare function l(strings: string[], ...expressions: (Expression | Statement)[]): Expression | Statement[];
export = l;

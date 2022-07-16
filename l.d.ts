import Expression = require("./Expression");
import Statement = require("./Statement");
import Program = require('./Program');
declare function l(strings: string[], ...expressions: (Expression | Statement)[]): Program;
export = l;

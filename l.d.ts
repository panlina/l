import * as Expression from "./Expression";
import * as Statement from "./Statement";
function l(strings: string[], ...expressions: (Expression | Statement)[]): Expression | Statement[];
export = l;

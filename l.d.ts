import * as Expression from "./Expression";
import * as Statement from "./Statement";
declare function l(strings: string[], ...expressions: (Expression | Statement)[]): Expression | Statement[];
export = l;

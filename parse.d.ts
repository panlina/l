import * as Expression from './Expression';
import * as Statement from './Statement';
declare function parse(text: string): Expression | Statement[];
export = parse;

import * as Expression from './Expression';
import * as Statement from './Statement';
declare function parse(text: string, startRule?: string): Expression | Statement[];
export = parse;

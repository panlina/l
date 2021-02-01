import * as Expression from './Expression';
import * as Statement from './Statement';
declare function generate(program: Expression | Statement | Statement[]): string;
export = generate;

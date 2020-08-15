import * as Expression from './Expression';
import * as Statement from './Statement';
function generate(program: Expression | Statement | Statement[]): string;
export = generate;

import * as Expression from './Expression';
import * as Statement from './Statement';
declare function programAt(program: Expression | Statement[], position: number): Expression | Statement;
export = programAt;

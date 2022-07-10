import * as Environment from './Environment';
import * as Expression from './Expression';
import * as Statement from './Statement';
declare function analyze(program: Expression | Statement[], environment: Environment<'variable' | 'label'>): void;
export = analyze;

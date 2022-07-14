import Environment = require('./Environment');
import Expression = require('./Expression');
import Statement = require('./Statement');
declare function analyze(program: Expression | Statement[], environment: Environment<'variable' | 'label'>): void;
export = analyze;

import Environment = require('./Environment');
import Program = require('./Program');
declare function analyze(program: Program, environment: Environment<'variable' | 'label'>): void;
export = analyze;

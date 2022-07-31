import Scope = require('./Scope');
import Expression = require('./Expression');
import Annotated = require('./Annotated');

declare class AnalyzedScope extends Scope<'variable' | 'label'>{
	definition: { [key: string]: Annotated<Expression.Name> };
}

export = AnalyzedScope;

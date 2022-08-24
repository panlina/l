import Expression = require('./Expression');
declare function findReferences(name: Expression.Name): Generator<Expression.Name>;
export = findReferences;

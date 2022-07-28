import Expression = require('./Expression');
declare class Label {
	constructor(name: Expression.Name);
	name: Expression.Name;
}
export = Label;

import Scope = require('./Scope');

declare class Environment<T> {
	constructor(scope: Scope<T>, parent?: Environment<T>);
	scope: Scope<T>;
	parent: Environment<T> | undefined;
	resolve(name: string): [T, Scope<T>] | undefined;
	push(scope: Scope<T>): Environment<T>;
}

export = Environment;

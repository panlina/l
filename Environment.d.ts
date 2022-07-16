import Scope = require('./Scope');

declare class Environment<T> {
	constructor(scope: Scope<T>, parent: Environment<T> | undefined);
	scope: Scope<T>;
	parent: Environment<T> | undefined;
	resolve(name: string): [T, number] | undefined;
	ancestor(depth: number): Environment<T>;
	push(scope: Scope<T>): Environment<T>;
}

export = Environment;

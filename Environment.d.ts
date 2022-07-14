import Scope = require('./Scope');

declare class Environment<T> {
	constructor(scope: Environment<T>['scope'], parent: Environment<T>['parent']);
	scope: Scope<T>;
	parent: Environment<T> | undefined;
	resolve(name: string): [T, number] | undefined;
	ancestor(depth: number): Environment<T>;
	push(scope: Scope<T>): Environment<T>;
}

export = Environment;

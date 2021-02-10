import * as Scope from './Scope';

export = class Environment<T> {
	constructor(scope: Environment['scope'], parent: Environment['parent']);
	scope: Scope<T>;
	parent: Environment<T> | undefined;
	resolve(name: string): [T, number] | undefined;
	ancestor(depth: number): Environment<T>;
	push(scope: Scope<T>): Environment<T>;
}

import * as Scope from './Scope';

export = class Environment {
	constructor(scope: Environment['scope'], parent: Environment['parent']);
	scope: Scope;
	parent: Environment | undefined;
	resolve(name: string): [T, number] | undefined;
	ancestor(depth: number): Environment;
	push(scope: Scope): Environment;
}

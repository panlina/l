declare class Scope<T> {
	constructor(name: { [key: string]: T; });
	name: { [key: string]: T };
	resolve(name: string): T | undefined;
}

export = Scope;

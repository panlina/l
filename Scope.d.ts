declare class Scope<T> {
	constructor(variable: { [key: string]: T; });
	[key: string]: T;
	resolve(name: string): T | undefined;
}

export = Scope;

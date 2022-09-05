declare class Scope<T> {
	constructor(name: { [key: string]: T; });
	name: { [key: string]: T };
}

export = Scope;

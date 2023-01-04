class Environment {
	constructor(scope, parent) {
		this.scope = scope;
		this.parent = parent;
	}
	resolve(name) {
		if (name in this.scope.name)
			return [this.scope.name[name], this.scope];
		if (this.parent)
			return this.parent.resolve(name);
	}
	push(scope) { return new Environment(scope, this); }
	*[Symbol.iterator]() {
		for (var environment = this; environment; environment = environment.parent)
			yield environment.scope;
	}
}
module.exports = Environment;

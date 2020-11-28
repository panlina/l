class Environment {
	constructor(scope, parent) {
		this.scope = scope;
		this.parent = parent;
	}
	resolve(name) {
		var resolution = this.scope.resolve(name);
		if (resolution !== undefined)
			return [resolution, 0];
		if (this.parent) {
			var resolution = this.parent.resolve(name);
			if (resolution) {
				var [value, depth] = resolution;
				return [value, depth + 1];
			}
		}
	}
	ancestor(depth) {
		return depth ?
			this.parent.ancestor(depth - 1) :
			this;
	}
	push(scope) { return new Environment(scope, this); }
}
module.exports = Environment;

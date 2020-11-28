class Scope {
	constructor(variable) {
		Object.assign(this, variable);
	}
	resolve(name) {
		if (name in this)
			return this[name];
	}
}
module.exports = Scope;

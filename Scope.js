class Scope {
	constructor(name) {
		Object.assign(this, name);
	}
	resolve(name) {
		if (name in this)
			return this[name];
	}
}
module.exports = Scope;

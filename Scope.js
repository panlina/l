class Scope {
	constructor(name) {
		this.name = name;
	}
	resolve(name) {
		if (name in this.name)
			return this.name[name];
	}
}
module.exports = Scope;

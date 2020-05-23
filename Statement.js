class Statement {
	constructor(type) {
		this.type = type;
	}
}

class Assign extends Statement {
	constructor(left, right) {
		super('assign');
		this.left = left;
		this.right = right;
	}
}

class Placeholder extends Statement {
	constructor(name) {
		super('placeholder');
		this.name = name;
	}
}

module.exports = Statement;
module.exports.Assign = Assign;
module.exports.Placeholder = Placeholder;

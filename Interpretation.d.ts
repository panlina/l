import Expression from './Expression';
interface Interpretation<T> {
	expression: {
		literal: (expression: Expression.Literal) => T;
		name: (expression: Expression.Name, resolution: [null, number]) => T;
		object: ($property: { name: string, value: T }[]) => T;
		array: ($element: T[]) => T;
		tuple: ($element: T[]) => T;
		property: ($expression: T, $property: string) => T;
		element: ($expression: T, $index: T) => T;
		call: ($expression: T, $argument: T) => T;
		operation: ($operator: string, $left?: T, $right?: T) => T;
		conditional: ($condition: T, $true: T, $false: T) => T;
		statement: ($statement: T) => T;
	};
	statement: {
		'[]': ($statement: T[]) => T;
		assign: (
			$left:
				{ type: "name", identifier: string, resolution: [null, number] }
				|
				{ type: "element", expression: T, index: T }
				|
				{ type: "property", expression: T, property: string },
			$right: T
		) => T;
		block: ($statement: T) => T;
		expression: ($expression: T) => T;
	};
};
export = Interpretation;

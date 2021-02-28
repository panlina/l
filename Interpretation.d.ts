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
	};
	statement: {
		'[]': ($statement: T[]) => T;
	};
	assign: {
		name: ($left: { identifier: string, resolution: [null, number] }, $right: T) => T;
		element: ($left: { expression: T, index: T }, $right: T) => T;
		property: ($left: { expression: T, property: string }, $right: T) => T;
	};
	concat: ($effect: T, $return: T) => T;
	pushScope: (f: T) => T;
}
export = Interpretation;

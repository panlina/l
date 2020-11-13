import Expression from './Expression';
interface Interpretation<T> {
	expression: {
		literal: (expression: Expression.Literal) => T;
		name: (expression: Expression.Name) => T;
		object: ($property: { name: string, value: T }[]) => T;
		array: ($element: T[]) => T;
		tuple: ($element: T[]) => T;
		property: ($expression: T, $property: string) => T;
		element: ($expression: T, $index: T) => T;
		call: ($expression: T, $argument: T) => T;
	};
	statement: {
		'[]': ($statement: T[]) => T;
		assign: ($left: string, $right: T) => T;
	};
};
export = Interpretation;

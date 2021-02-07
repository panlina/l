import Expression from './Expression';
import Environment from './Environment';
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
		assign: (
			$left:
				{ type: "name", identifier: string, resolution: [null, number] }
				|
				{ type: "element", expression: T, index: T }
				|
				{ type: "property", expression: T, property: string },
			$right: T
		) => T;
	};
	concat: ($effect: T, $return: T, $scope?: (environment: Environment) => Environment) => T;
}
export = Interpretation;

import Expression from './Expression';
import { Label } from './Statement';
interface Interpretation<T> {
	expression: {
		undefined: (expression: Expression.Undefined) => T;
		null: (expression: Expression.Null) => T;
		boolean: (expression: Expression.Boolean) => T;
		number: (expression: Expression.Number) => T;
		string: (expression: Expression.String) => T;
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
		'[]': ($statement: (T | Label)[]) => T;
		goto: (label: Label) => T;
	};
	assign: {
		name: ($left: { identifier: string, resolution: [null, number] }, $right: T) => T;
		element: ($left: { expression: T, index: T }, $right: T) => T;
		property: ($left: { expression: T, property: string }, $right: T) => T;
	};
	concat: ($effect: T, $return: T) => T;
	pushScope: (f: T) => T;
	pushScopeArgument: (f: T) => T;
}
export = Interpretation;

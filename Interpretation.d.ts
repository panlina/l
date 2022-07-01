import Expression from './Expression';
import Statement from './Statement';
import { Label } from './Statement';
interface Interpretation<T> {
	expression: {
		undefined: (expression: Expression.Undefined) => T;
		null: (expression: Expression.Null) => T;
		boolean: (expression: Expression.Boolean) => T;
		number: (expression: Expression.Number) => T;
		string: (expression: Expression.String) => T;
		name: (expression: Expression.Name, resolution: ['variable', number]) => T;
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
		'[]': ($statement: (T | Statement.Var | Label)[], $expression: T) => T;
		goto: (label: Label) => T;
	};
	assign: {
		name: ($left: { identifier: string, resolution: ['variable', number] }, $right: T) => T;
		element: ($left: { expression: T, index: T }, $right: T) => T;
		property: ($left: { expression: T, property: string }, $right: T) => T;
	};
	abstract: (f: T) => T;
}
export = Interpretation;

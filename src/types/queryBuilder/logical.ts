import { QueryField } from '..';

export type IfArgs = {
  expression: QueryField;
  ifTrue: QueryField;
  ifFalse: QueryField;
};

export type SwitchArgs = {
  expression: QueryField;
  cases: {
    switchCase: QueryField;
    val: QueryField;
  }[];
  defaultVal: QueryField;
};

/** @ignore */
type ExpressionFunc = (expression: QueryField) => string;
/** @ignore */
type ArrayExpressionFunc = (args: QueryField[]) => string;
/** @ignore */
type IfFunc = (arg: IfArgs) => string;
/** @ignore */
type SwitchFunc = (args: SwitchArgs) => string;
/** @ignore */
export interface ExpressionFuncs extends Record<string, ExpressionFunc> {
  $not: ExpressionFunc;
  $isError: ExpressionFunc;
}
/** @ignore */
export interface ArrayExpressionFuncs
  extends Record<string, ArrayExpressionFunc> {
  $and: ArrayExpressionFunc;
  $or: ArrayExpressionFunc;
  $xor: ArrayExpressionFunc;
}
/** @ignore */
export interface IfFunction extends Record<string, IfFunc> {
  $if: IfFunc;
}
/** @ignore */
export interface SwitchFunction extends Record<string, SwitchFunc> {
  $switch: SwitchFunc;
}

export interface LogicalFunctions
  extends ExpressionFuncs,
    ArrayExpressionFuncs,
    IfFunction,
    SwitchFunction {}

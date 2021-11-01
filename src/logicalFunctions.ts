import {
  ArrayExpressionFuncs,
  ExpressionFuncs,
  IfArgs,
  IfFunction,
  QueryField,
  SwitchFunction,
} from './types';
import { handleError, queryBuilder } from './queryBuilder';
import {
  isQueryObjectArray,
  isQueryObject,
  isIfArgs,
  isSwitchArgs,
} from './typeCheckers';

export const arrayArgFuncs: ArrayExpressionFuncs = {
  $and: (args: QueryField[]): string => `AND(${queryBuilder(args)})`,
  $or: (args: QueryField[]): string => `OR(${queryBuilder(args)})`,
  $xor: (args: QueryField[]): string => `XOR(${queryBuilder(args)})`,
};

export const expressionFuncs: ExpressionFuncs = {
  $not: (expression: QueryField): string => `NOT(${queryBuilder(expression)})`,
  $isError: (expression: QueryField): string =>
    `ISERROR(${queryBuilder(expression)})`,
};

export const ifFunc: IfFunction = {
  $if: ({ expression, ifTrue, ifFalse }: IfArgs): string =>
    `IF(${queryBuilder(expression)}, ${queryBuilder(ifTrue)}, ${queryBuilder(
      ifFalse,
    )})`,
};

export const switchFunc: SwitchFunction = {
  $switch: ({ expression, cases, defaultVal }): string =>
    `SWITCH(${queryBuilder(expression)}, ${cases
      .slice(0)
      .map(
        ({ switchCase, val }) =>
          `${queryBuilder(switchCase)}, ${queryBuilder(val)}`,
      )
      .join(', ')}, ${queryBuilder(defaultVal)})`,
};

export const logicalFunctions = {
  ...arrayArgFuncs,
  ...expressionFuncs,
  ...ifFunc,
  ...switchFunc,
};

export const handleLogicalFunc = (key: string, val: QueryField): string => {
  if (key in arrayArgFuncs && isQueryObjectArray(val)) {
    return arrayArgFuncs[key](val);
  } else if (key in expressionFuncs && isQueryObject(val)) {
    return expressionFuncs[key](val);
  } else if (key in ifFunc && isIfArgs(val)) {
    return ifFunc[key](val);
  } else if (key in switchFunc && isSwitchArgs(val)) {
    return switchFunc[key](val);
  }
  throw handleError({ key, val });
};

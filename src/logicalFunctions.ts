import {
  ArrayExpressionFuncs,
  ExpressionFuncs,
  IfArgs,
  IfFuncs,
  QueryField,
  SwitchFuncs,
} from './@types';
import { queryBuilder } from './queryBuilder';

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

export const ifFunc: IfFuncs = {
  $if: ({ expression, ifTrue, ifFalse }: IfArgs): string =>
    `IF(${queryBuilder(expression)}, ${queryBuilder(ifTrue)}, ${queryBuilder(
      ifFalse,
    )})`,
};

export const switchFunc: SwitchFuncs = {
  $switch: ({ expression, cases, defaultVal }): string =>
    `SWITCH(${queryBuilder(expression)}, ${cases
      .slice(0)
      .map(
        ({ switchCase, val }) =>
          `${queryBuilder(switchCase)}, ${queryBuilder(val)}`,
      )
      .join(', ')}, ${queryBuilder(defaultVal)})`,
};

export const errorFunc = {
  $error: (): string => 'ERROR()',
};

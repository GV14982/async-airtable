import {
  ArrayExpressionFuncs,
  ExpressionFuncs,
  IfFuncs,
  QueryField,
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
  $if: (expression: QueryField, val1: QueryField, val2: QueryField): string =>
    `IF(${queryBuilder(expression)}, ${queryBuilder(val1)}, ${queryBuilder(
      val2,
    )})`,
};

export const switchFunc = {
  $switch: (expression: QueryField, ...rest: QueryField[]): string =>
    `SWITCH(${queryBuilder(expression)}, ${rest
      .slice(0, rest.length - 2)
      .map((v) => queryBuilder(v))
      .join(', ')}${queryBuilder(rest[rest.length - 1])})`,
};

export const errorFunc = {
  $error: (): string => 'ERROR()',
};

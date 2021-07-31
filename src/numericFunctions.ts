import { buildExpression } from './buildExpression';
import { queryBuilder } from './queryBuilder';
import {
  ArrayArgNumFunctions,
  CeilFloorNumFunctions,
  LogNumFunction,
  ModNumFunction,
  NumericOperators,
  PowerNumFunction,
  RoundNumFunctions,
  SingleArgNumFunctions,
} from './types/queryBuilder/numeric';

export const singleArgNumFunctions: SingleArgNumFunctions = {
  $abs: (arg) => `ABS(${queryBuilder(arg)})`,
  $even: (arg) => `EVEN(${queryBuilder(arg)})`,
  $exp: (arg) => `EXP(${queryBuilder(arg)})`,
  $int: (arg) => `INT(${queryBuilder(arg)})`,
  $odd: (arg) => `ODD(${queryBuilder(arg)})`,
  $sqrt: (arg) => `SQRT(${queryBuilder(arg)})`,
};

export const arrayArgNumFunctions: ArrayArgNumFunctions = {
  $avg: (arg) => `AVERAGE(${arg.map((a) => queryBuilder(a)).join(', ')})`,
  $count: (arg) => `COUNT(${arg.map((a) => queryBuilder(a)).join(', ')})`,
  $counta: (arg) => `COUNTA(${arg.map((a) => queryBuilder(a)).join(', ')})`,
  $countAll: (arg) => `COUNTALL(${arg.map((a) => queryBuilder(a)).join(', ')})`,
  $max: (arg) => `MAX(${arg.map((a) => queryBuilder(a)).join(', ')})`,
  $min: (arg) => `MIN(${arg.map((a) => queryBuilder(a)).join(', ')})`,
  $sum: (arg) => `SUM(${arg.map((a) => queryBuilder(a)).join(', ')})`,
};

export const ceilFloorNumFunctions: CeilFloorNumFunctions = {
  $ceil: ({ val, significance }) =>
    `CEILING(${queryBuilder(val)}, ${queryBuilder(significance ?? 1)})`,
  $floor: ({ val, significance }) =>
    `FLOOR(${queryBuilder(val)}, ${queryBuilder(significance ?? 1)})`,
};

export const logNumFunction: LogNumFunction = {
  $log: ({ num, base }) =>
    `LOG(${queryBuilder(num)}, ${queryBuilder(base ?? 10)})`,
};

export const modNumFunction: ModNumFunction = {
  $mod: ({ val, divisor }) =>
    `MOD(${queryBuilder(val)}, ${queryBuilder(divisor)})`,
};

export const powerNumFunction: PowerNumFunction = {
  $pow: ({ base, power }) =>
    `POWER(${queryBuilder(base)}, ${queryBuilder(power)})`,
};

export const roundNumFunctions: RoundNumFunctions = {
  $round: ({ val, precision }) =>
    `ROUND(${queryBuilder(val)}, ${queryBuilder(precision)})`,
  $roundDown: ({ val, precision }) =>
    `ROUNDDOWN(${queryBuilder(val)}, ${queryBuilder(precision)})`,
  $roundUp: ({ val, precision }) =>
    `ROUNDUP(${queryBuilder(val)}, ${queryBuilder(precision)})`,
};

export const numericalFunctions = {
  ...singleArgNumFunctions,
  ...arrayArgNumFunctions,
  ...ceilFloorNumFunctions,
  ...logNumFunction,
  ...modNumFunction,
  ...powerNumFunction,
  ...roundNumFunctions,
};

export const numericOperators: NumericOperators = {
  $add: (arg) => buildExpression(arg, '+'),
  $sub: (arg) => buildExpression(arg, '-'),
  $multi: (arg) => buildExpression(arg, '*'),
  $div: (arg) => buildExpression(arg, '/'),
};

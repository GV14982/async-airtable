import { buildExpression } from './buildExpression';
import { handleError, queryBuilder } from './queryBuilder';
import {
  isNumArgArray,
  isNumArg,
  isCeilFloorArg,
  isLogArg,
  isModArg,
  isPowerArg,
  isRoundArg,
} from './typeCheckers';
import { QueryField } from './types';
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

export const handleNumericalFunc = (key: string, val: QueryField): string => {
  if (key in arrayArgNumFunctions && isNumArgArray(val)) {
    return arrayArgNumFunctions[key](val);
  } else if (key in singleArgNumFunctions && isNumArg(val)) {
    return singleArgNumFunctions[key](val);
  } else if (key in ceilFloorNumFunctions && isCeilFloorArg(val)) {
    return ceilFloorNumFunctions[key](val);
  } else if (key in logNumFunction && isLogArg(val)) {
    return logNumFunction[key](val);
  } else if (key in modNumFunction && isModArg(val)) {
    return modNumFunction[key](val);
  } else if (key in powerNumFunction && isPowerArg(val)) {
    return powerNumFunction[key](val);
  } else if (key in roundNumFunctions && isRoundArg(val)) {
    return roundNumFunctions[key](val);
  }
  throw handleError({ key, val });
};

import { ComparisonObject } from './@types';
import { queryBuilder } from './queryBuilder';

const operators = ['=', '!=', '>', '>=', '<', '<='];

export const buildExpression = (obj: ComparisonObject, op: string): string => {
  if (typeof obj !== 'object' || Array.isArray(obj))
    throw new Error('Missing or Invalid Comparison Object');
  if (typeof op !== 'string' && !operators.includes(op))
    throw new Error('Missing or Invalid Comparison Operator');
  const keys = Object.keys(obj);
  const expressionMapper = (k: string, i: number) => {
    const val = queryBuilder(obj[k]);
    return `{${k}} ${op} ${val}${i < keys.length - 1 ? ', ' : ''}`;
  };

  const exp = `${keys.map(expressionMapper).join('')}`;
  return keys.length > 1 ? `AND(${exp})` : exp;
};

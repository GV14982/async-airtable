import { LogicalOperators } from './types';
import { buildExpression } from './buildExpression';

export const logicalOperators: LogicalOperators = {
  $gt: (val) => {
    return buildExpression(val, '>');
  },
  $lt: (val) => {
    return buildExpression(val, '<');
  },
  $gte: (val) => {
    return buildExpression(val, '>=');
  },
  $lte: (val) => {
    return buildExpression(val, '<=');
  },
  $eq: (val) => {
    return buildExpression(val, '=');
  },
  $neq: (val) => {
    return buildExpression(val, '!=');
  },
};

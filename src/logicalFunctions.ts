import { LogicalFunctions, QueryObject } from './@types';
import { queryBuilder } from './queryBuilder';

export const logicalFunctions: LogicalFunctions = {
  $not: (expression: QueryObject) => `NOT(${queryBuilder(expression)})`,
  $and: (args: QueryObject[]) => `AND(${queryBuilder(args)})`,
  $or: (args: QueryObject[]) => `OR(${queryBuilder(args)})`,
};

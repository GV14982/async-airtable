import { BaseFieldType, QueryObject } from '..';

/** @ignore */
export type ComparisonObject = Record<string, BaseFieldType | QueryObject>;

/** @ignore */
type ComparisonFunction = (vals: ComparisonObject) => string;

/** @ignore */
export interface LogicalOperators extends Record<string, ComparisonFunction> {
  $lt: ComparisonFunction;
  $gt: ComparisonFunction;
  $lte: ComparisonFunction;
  $gte: ComparisonFunction;
  $eq: ComparisonFunction;
  $neq: ComparisonFunction;
}

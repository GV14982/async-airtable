import { QueryField } from '../queryBuilder';

/** @ignore */
type ArrayFunction = (arg: QueryField, separator?: QueryField) => string;

/** @ignore */
export interface ArrayFunctions extends Record<string, ArrayFunction> {
  $arrayCompact: ArrayFunction;
  $arrayFlatten: ArrayFunction;
  $arrayUnique: ArrayFunction;
  $arrayJoin: ArrayFunction;
}

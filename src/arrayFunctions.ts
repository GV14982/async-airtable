import { queryBuilder } from './queryBuilder';
import { ArrayFunctions, QueryField } from './types';

export const arrayFunctions: ArrayFunctions = {
  $arrayCompact: (val: QueryField): string => {
    return `ARRAYCOMPACT(${queryBuilder(val)})`;
  },
  $arrayFlatten: (val: QueryField): string => {
    return `ARRAYFLATTEN(${queryBuilder(val)})`;
  },
  $arrayUnique: (val: QueryField): string => {
    return `ARRAYUNIQUE(${queryBuilder(val)})`;
  },
  $arrayJoin: (val: QueryField, seperator = ','): string => {
    return `ARRAYJOIN(${queryBuilder(val)}, ${queryBuilder(seperator)})`;
  },
};

import { ArrayFunctions } from './types';

export const arrayFunctions: ArrayFunctions = {
  $arrayCompact: (fieldName: string): string => {
    return `ARRAYCOMPACT({${fieldName}})`;
  },
  $arrayFlatten: (fieldName: string): string => {
    return `ARRAYFLATTEN({${fieldName}})`;
  },
  $arrayUnique: (fieldName: string): string => {
    return `ARRAYUNIQUE({${fieldName}})`;
  },
  $arrayJoin: (fieldName: string, seperator = ','): string => {
    return `ARRAYJOIN({${fieldName}}, '${seperator}')`;
  },
};

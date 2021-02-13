import { FieldNameObject, QueryObject, TextFunctions } from './@types';
import { baseHandler } from './baseHandlers';
import { queryBuilder } from './queryBuilder';

export const textFunctions: TextFunctions = {
  $textFind: (
    search: FieldNameObject | string | QueryObject,
    set: FieldNameObject | string | QueryObject,
    startIndex = 0,
  ): string =>
    `FIND(${
      typeof search === 'string' ? baseHandler(search) : queryBuilder(search)
    }, ${
      typeof set === 'string' ? baseHandler(set) : queryBuilder(set)
    }, ${startIndex})`,
  $textSearch: (
    search: FieldNameObject | string | QueryObject,
    set: FieldNameObject | string | QueryObject,
    startIndex = 0,
  ): string =>
    `SEARCH(${
      typeof search === 'string' ? baseHandler(search) : queryBuilder(search)
    }, ${
      typeof set === 'string' ? baseHandler(set) : queryBuilder(set)
    }, ${startIndex})`,
};

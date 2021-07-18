import { TextSearchArgs, TextSearchFunctions } from './@types';
import { queryBuilder } from './queryBuilder';

export const textSearchFunctions: TextSearchFunctions = {
  $textFind: ({ searchText, query, index }: TextSearchArgs): string =>
    `FIND(${queryBuilder(query)}, ${queryBuilder(searchText)}, ${index ?? 0})`,
  $textSearch: ({ searchText, query, index }: TextSearchArgs): string =>
    `SEARCH(${queryBuilder(query)}, ${queryBuilder(searchText)}, ${
      index ?? 0
    })`,
};

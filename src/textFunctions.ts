import {
  TextConcatFunctions,
  TextDoubleArgumentFunctions,
  TextMidFunction,
  TextReplaceFunctions,
  TextSearchFunctions,
  TextSingleArgumentFunctions,
  TextSubFunctions,
} from './types';
import { queryBuilder } from './queryBuilder';

export const textSearchFunctions: TextSearchFunctions = {
  $find: ({ stringToFind, whereToSearch, index }) =>
    `FIND(${queryBuilder(stringToFind)}, ${queryBuilder(whereToSearch)}, ${
      index ?? 0
    })`,
  $search: ({ stringToFind, whereToSearch, index }) =>
    `SEARCH(${queryBuilder(stringToFind)}, ${queryBuilder(whereToSearch)}, ${
      index ?? 0
    })`,
};

export const textReplacementFunction: TextReplaceFunctions = {
  $replace: ({ text, startChar, numChars, replacement }) =>
    `REPLACE(${queryBuilder(text)}, ${queryBuilder(startChar)}, ${queryBuilder(
      numChars,
    )}, ${queryBuilder(replacement)})`,
};

export const textSubstituteFunction: TextSubFunctions = {
  $substitute: ({ text, oldText, newText, index }) =>
    `SUBSTITUTE(${queryBuilder(text)}, ${queryBuilder(oldText)}, ${queryBuilder(
      newText,
    )}, ${index ?? 0})`,
};

export const textConcatFunction: TextConcatFunctions = {
  $concatenate: (args) =>
    `CONCATENATE(${args.map((a) => queryBuilder(a)).join(', ')})`,
};

export const textDoubleArgumentFunctions: TextDoubleArgumentFunctions = {
  $left: ({ text, num }) => `LEFT(${queryBuilder(text)}, ${queryBuilder(num)})`,
  $right: ({ text, num }) =>
    `RIGHT(${queryBuilder(text)}, ${queryBuilder(num)})`,
  $rept: ({ text, num }) => `REPT(${queryBuilder(text)}, ${queryBuilder(num)})`,
};

export const textMidFunction: TextMidFunction = {
  $mid: ({ text, whereToStart, num }) =>
    `MID(${queryBuilder(text)}, ${queryBuilder(whereToStart)}, ${queryBuilder(
      num,
    )})`,
};

export const textSingleArgumentFunctions: TextSingleArgumentFunctions = {
  $encodeUrlComponent: (str) => `ENCODE_URL_COMPONENT(${queryBuilder(str)})`,
  $len: (str) => `LEN(${queryBuilder(str)})`,
  $lower: (str) => `LOWER(${queryBuilder(str)})`,
  $trim: (str) => `TRIM(${queryBuilder(str)})`,
  $upper: (str) => `UPPER(${queryBuilder(str)})`,
};

export const textFunctions = {
  ...textSearchFunctions,
  ...textConcatFunction,
  ...textMidFunction,
  ...textReplacementFunction,
  ...textSubstituteFunction,
  ...textDoubleArgumentFunctions,
  ...textSingleArgumentFunctions,
};

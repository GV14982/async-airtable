import {
  QueryField,
  TextConcatFunctions,
  TextDoubleArgumentFunctions,
  TextMidFunction,
  TextReplaceFunctions,
  TextSearchFunctions,
  TextSingleArgumentFunctions,
  TextSubFunctions,
} from './types';
import { handleError, queryBuilder } from './queryBuilder';
import {
  isTextSearchArgs,
  isTextArgArray,
  isTextMidArgs,
  isTextReplaceArgs,
  isTextSubArgs,
  isTextDoubleArg,
  isStringOrFieldNameObject,
  isQueryObject,
} from './typeCheckers';

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

export const handleTextFunc = (key: string, val: QueryField): string => {
  if (key in textSearchFunctions && isTextSearchArgs(val)) {
    return textSearchFunctions[key](val);
  } else if (key in textConcatFunction && isTextArgArray(val)) {
    return textConcatFunction[key](val);
  } else if (key in textMidFunction && isTextMidArgs(val)) {
    return textMidFunction[key](val);
  } else if (key in textReplacementFunction && isTextReplaceArgs(val)) {
    return textReplacementFunction[key](val);
  } else if (key in textSubstituteFunction && isTextSubArgs(val)) {
    return textSubstituteFunction[key](val);
  } else if (key in textDoubleArgumentFunctions && isTextDoubleArg(val)) {
    return textDoubleArgumentFunctions[key](val);
  } else if (
    key in textSingleArgumentFunctions &&
    (isStringOrFieldNameObject(val) || isQueryObject(val))
  ) {
    return textSingleArgumentFunctions[key](val);
  }
  throw handleError({ key, val });
};

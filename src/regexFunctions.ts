import { queryBuilder } from './queryBuilder';
import { RegexFunctions, RegexReplaceFunction } from './types';

export const regexFunctions: RegexFunctions = {
  $regexMatch: ({ text, regex }) =>
    `REGEX_MATCH(${queryBuilder(text)}, ${queryBuilder(regex)})`,
  $regexExtract: ({ text, regex }) =>
    `REGEX_EXTRACT(${queryBuilder(text)}, ${queryBuilder(regex)})`,
};

export const regexReplaceFunction: RegexReplaceFunction = {
  $regexReplace: ({ text, regex, replacement }) =>
    `REGEX_REPLACE(${queryBuilder(text)}, ${queryBuilder(
      regex,
    )}, ${queryBuilder(replacement)})`,
};

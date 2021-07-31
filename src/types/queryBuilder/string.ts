import { NumArg, TextArg } from '..';

export type TextSearchArgs = {
  stringToFind: TextArg;
  whereToSearch: TextArg;
  index?: NumArg;
};

export type TextReplaceArgs = {
  text: TextArg;
  startChar: NumArg;
  numChars: NumArg;
  replacement: TextArg;
};

export type TextSubArgs = {
  text: TextArg;
  oldText: TextArg;
  newText: TextArg;
  index?: NumArg;
};

export type TextMidArgs = {
  text: TextArg;
  whereToStart: NumArg;
  num: NumArg;
};

export type TextDoubleArg = {
  text: TextArg;
  num: NumArg;
};
/** @ignore */
type TextSearchFunction = (arg: TextSearchArgs) => string;
type TextReplaceFunction = (arg: TextReplaceArgs) => string;
type TextSubFunction = (arg: TextSubArgs) => string;
type TextConcatFunction = (args: TextArg[]) => string;
type TextDoubleArgFunc = (arg: TextDoubleArg) => string;
type TextSingleArgFunc = (arg: TextArg) => string;
type TextMidFunc = (arg: TextMidArgs) => string;
export interface TextSearchFunctions
  extends Record<string, TextSearchFunction> {
  $find: TextSearchFunction;
  $search: TextSearchFunction;
}
export interface TextReplaceFunctions
  extends Record<string, TextReplaceFunction> {
  $replace: TextReplaceFunction;
}
export interface TextSubFunctions extends Record<string, TextSubFunction> {
  $substitute: TextSubFunction;
}
export interface TextConcatFunctions
  extends Record<string, TextConcatFunction> {
  $concatenate: TextConcatFunction;
}

export interface TextDoubleArgumentFunctions
  extends Record<string, TextDoubleArgFunc> {
  $left: TextDoubleArgFunc;
  $right: TextDoubleArgFunc;
  $rept: TextDoubleArgFunc;
}

export interface TextMidFunction extends Record<string, TextMidFunc> {
  $mid: TextMidFunc;
}

export interface TextSingleArgumentFunctions
  extends Record<string, TextSingleArgFunc> {
  $encodeUrlComponent: TextSingleArgFunc;
  $len: TextSingleArgFunc;
  $lower: TextSingleArgFunc;
  $trim: TextSingleArgFunc;
  $upper: TextSingleArgFunc;
}

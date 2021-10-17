import { TextArg } from '..';

export type RegexArgs = { text: TextArg; regex: TextArg };
export type RegexReplaceArgs = {
  text: TextArg;
  regex: TextArg;
  replacement: TextArg;
};
export type RegexFunc = (arg: RegexArgs) => string;
export type RegexReplaceFunc = (arg: RegexReplaceArgs) => string;
export interface RegexFunctions extends Record<string, RegexFunc> {
  $regexMatch: RegexFunc;
  $regexExtract: RegexFunc;
}
export interface RegexReplaceFunction extends Record<string, RegexReplaceFunc> {
  $regexReplace: RegexReplaceFunc;
}

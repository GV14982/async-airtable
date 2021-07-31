import {
  AirtableUpdateRecord,
  SelectOptions,
  TextSearchArgs,
  RegexArgs,
} from './';
import { IfArgs, SwitchArgs } from './queryBuilder/logical';
import {
  CeilFloorArg,
  LogArg,
  ModArg,
  PowerArg,
  RoundArg,
} from './queryBuilder/numeric';
import { RegexReplaceArgs } from './queryBuilder/regex';
import {
  TextMidArgs,
  TextReplaceArgs,
  TextSubArgs,
} from './queryBuilder/string';

/**
 * An object to handle filtering the records returned by the #select and #upsert methods.
 *
 * @example
 * ```
 * {
 *   id: 'Some ID',
 *   count: {
 *     $lt: 10,
 *     $gt: 5
 *   },
 *   $or: [
 *     active: true,
 *     name: 'active'
 *   ]
 * }
 * ```
 */

interface AirtableFilters extends QueryObject {
  /**
   * Less than operator
   *
   * @example
   * ```
   * {field: {$lt: value}}
   * ```
   */
  $lt?: QueryObject;
  /**
   * Greater than operator
   *
   * @example
   * ```
   * {field: {$gt: value}}
   * ```
   */
  $gt?: QueryObject;
  /**
   * Less than or equal operator
   *
   * @example
   * ```
   * {field: {$lte: value}}
   * ```
   */
  $lte?: QueryObject;
  /**
   * Greater than or equal operator
   *
   * @example
   * ```
   * {field: {$gte: value}}
   * ```
   */
  $gte?: QueryObject;
  /**
   * Equal operator
   *
   * @example
   * ```
   * {field: {$eq: value}}
   * ```
   */
  $eq?: QueryObject;
  /**
   * Not equal operator
   *
   * @example
   * ```
   * {field: {$neq: value}}
   * ```
   */
  $neq?: QueryObject;
  /**
   * Addition operator
   */
  $add?: QueryObject;
  /**
   * Subtraction operator
   */
  $sub?: QueryObject;
  /**
   * Multiplication operator
   */
  $multi?: QueryObject;
  /**
   * Division operator
   */
  $div?: QueryObject;
  /**
   * NOT logical operator
   *
   * @example
   * ```
   * {$not: expression}
   * ```
   */
  $not?: BoolArg;
  /**
   * AND logical operator
   *
   * @example
   * ```
   * {$and: [{expression}, {expression}, ...{expression}]}
   * ```
   */
  $and?: BoolArg[];
  /**
   * OR logical operator
   *
   * @example
   * ```
   * {$or: [{expression}, {expression}, ...{expression}]}
   * ```
   */
  $or?: BoolArg[];
  /**
   * Returns value1 if the logical argument is true, otherwise it returns value2. Can also be used to make nested IF statements.
   * Can also be used to check if a cell is blank/is empty.
   */
  $if: IfArgs;
  /**
   * Takes an expression, a list of possible values for that expression, and for each one, a value that the expression should take in that case. It can also take a default value if the expression input doesn't match any of the defined patterns. In many cases, SWITCH() can be used instead of a nested IF formula.
   */
  $switch: SwitchArgs;
  /**
   * Returns true if an odd number of arguments are true.
   */
  $xor: BoolArg[];
  /**
   * Returns true if the expression causes an error.
   */
  $isError: QueryField;
  /**
   * Removes empty strings and null values from the array. Keeps "false" and strings that contain one or more blank characters.
   *
   * @example
   * ```
   * {$arrayCompact: "field name"}
   * ```
   */
  $arrayCompact?: string;
  /**
   * 	Takes all subarrays and flattens the elements into a single array.
   *
   * @example
   * ```
   * {$arrayFlatten: "field name"}
   * ```
   */
  $arrayFlatten?: string;
  /**
   * Filters out duplicate array elements.
   *
   * @example
   * ```
   * {$arrayUnique: "field name"}
   * ```
   */
  $arrayUnique?: string;
  /**
   * 	Joins all array elements into a string with the given separator
   *
   * @example
   * ```
   * {$arrayJoin: {fieldName: 'test', separator: '; '}}
   * ```
   * @default separator ","
   */
  $arrayJoin?: JoinArgs;
  /**
   * Finds an occurrence of stringToFind in whereToSearch string starting from an optional startFromPosition.(startFromPosition is 0 by default.) If no occurrence of stringToFind is found, the result will be 0.
   *
   * @example
   * ```
   * {$textFind: {searchText: 'test', query: 'test'}}
   * ```
   */
  $find?: TextSearchArgs;
  /**
   * Searches for an occurrence of stringToFind in whereToSearch string starting from an optional startFromPosition. (startFromPosition is 0 by default.) If no occurrence of stringToFind is found, the result will be empty.
   *
   * @example
   * ```
   * {$textSearch: {searchText: 'test', query: 'test'}}
   * ```
   */
  $search?: TextSearchArgs;
  /**
   * Joins together the text arguments into a single text value. To concatenate static text, surround it with double quotation marks. To concatenate double quotation marks, you need to use a backslash (\) as an escape character.
   */
  $concat?: TextArg[];
  /**
   * Replaces certain characters with encoded equivalents for use in constructing URLs or URIs. Does not encode the following characters: - _ . ~
   */
  $encodeUrlComponent?: TextArg;
  /**
   * Extract howMany characters from the beginning of the string.
   */
  $left?: TextArg;
  /**
   * Returns the length of a string.
   */
  $len?: TextArg;
  /**
   * Makes a string lowercase.
   */
  $lower?: TextArg;
  /**
   * Extract a substring of count characters starting at whereToStart.
   */
  $mid?: TextMidArgs;
  /**
   * Replaces the number of characters beginning with the start character with the replacement text.
   */
  $replace?: TextReplaceArgs;
  /**
   * Repeats string by the specified number of times.
   */
  $rept?: TextArg;
  /**
   * Extract howMany characters from the end of the string.
   */
  $right?: TextArg;
  /**
   * Replaces occurrences of old_text with new_text.
   *
   * You can optionally specify an index number (starting from 1) to replace just a specific occurrence of old_text. If no index number is specified, then all occurrences of old_text will be replaced.
   */
  $substitute?: TextSubArgs;
  /**
   * Removes whitespace at the beginning and end of string.
   */
  $trim?: TextArg;
  /**
   * Makes string uppercase.
   */
  $upper?: TextArg;
  /**
   * Returns the absolute value.
   */
  $abs?: NumArg;
  /**
   * 	Returns the average of the numbers.
   */
  $avg?: NumArg[];
  /**
   * Returns the nearest integer multiple of significance that is greater than or equal to the value. If no significance is provided, a significance of 1 is assumed.
   */
  $ceil?: CeilFloorArg;
  /**
   * Count the number of numeric items.
   */
  $count?: NumArg[];
  /**
   * Count the number of non-empty values. This function counts both numeric and text values.
   */
  $counta?: NumArg[];
  /**
   * Count the number of all elements including text and blanks.
   */
  $countAll?: NumArg[];
  /**
   * Returns the smallest even integer that is greater than or equal to the specified value.
   */
  $even?: NumArg;
  /**
   * Computes Euler's number (e) to the specified power.
   */
  $exp?: NumArg;
  /**
   * Returns the nearest integer multiple of significance that is less than or equal to the value. If no significance is provided, a significance of 1 is assumed.
   */
  $floor?: CeilFloorArg;
  /**
   * Returns the greatest integer that is less than or equal to the specified value.
   */
  $int?: NumArg;
  /**
   * Computes the logarithm of the value in provided base. The base defaults to 10 if not specified.
   */
  $log?: LogArg;
  /**
   * Returns the largest of the given numbers.
   */
  $max?: NumArg[];
  /**
   * Returns the smallest of the given numbers.
   */
  $min?: NumArg[];
  /**
   * 	Returns the remainder after dividing the first argument by the second.
   */
  $mod?: ModArg;
  /**
   * Rounds positive value up the the nearest odd number and negative value down to the nearest odd number.
   */
  $odd?: NumArg;
  /**
   * Computes the specified base to the specified power.
   */
  $pow?: PowerArg;
  /**
   * Rounds the value to the number of decimal places given by "precision." (Specifically, ROUND will round to the nearest integer at the specified precision, with ties broken by rounding half up toward positive infinity.)
   */
  $round?: RoundArg;
  /**
   * Rounds the value to the number of decimal places given by "precision," always rounding down, i.e., toward zero. (You must give a value for the precision or the function will not work.)
   */
  $roundDown?: RoundArg;
  /**
   * Rounds the value to the number of decimal places given by "precision," always rounding up, i.e., away from zero. (You must give a value for the precision or the function will not work.)
   */
  $roundUp?: RoundArg;
  /**
   * Returns the square root of a nonnegative number.
   */
  $sqrt?: NumArg;
  /**
   * Sum together the numbers. Equivalent to number1 + number2 + ...
   */
  $sum?: NumArg[];
  /**
   * Returns whether the input text matches a regular expression.
   */
  $regexMatch?: RegexArgs;
  /**
   * Returns the first substring that matches a regular expression.
   */
  $regexExtract?: RegexArgs;
  /**
   * Substitutes all matching substrings with a replacement string value.
   */
  $regexReplace?: RegexReplaceArgs;
  /**
   * Used for handling fieldNames in text methods
   *
   * @example
   * ```
   * {$textFind("text to find", {fieldName: "field to search"})}
   * ```
   */
  $fieldName?: string;
}
export interface QueryObject extends Record<string, QueryField> {
  /**
   * Shortform equal
   * (equivalent to $eq)
   *
   * @example
   * ```
   * {field: value}
   * ```
   */
  [key: string]: QueryField;
}

/** @ignore */
type ErrorFunc = () => string;
/** @ignore */
export interface ErrorFuncs extends Record<string, ErrorFunc> {
  $error: ErrorFunc;
}
/** @ignore */
export type QueryField =
  | QueryObject
  | QueryField[]
  | AirtableFilters
  | BaseFieldType
  | undefined;
/** @ignore */
export type BaseFieldType = string | number | boolean | null;

/**@ignore */
export type UncheckedArray = (QueryField | QueryField[] | undefined)[];

/** @ignore */
export type Arg =
  | string
  | number
  | boolean
  | SelectOptions
  | Record<string, unknown>[]
  | string[]
  | AirtableUpdateRecord
  | AirtableUpdateRecord[]
  | undefined;

/** For using a fieldname as a value in the query builder. */
export type FieldNameObject = {
  $fieldName: string;
};

export interface JoinArgs extends QueryObject {
  val: QueryField;
  separator?: QueryField;
}

export type TextArg = string | FieldNameObject | QueryObject;
export type NumArg = number | FieldNameObject | QueryObject;
export type BoolArg = boolean | FieldNameObject | QueryObject;

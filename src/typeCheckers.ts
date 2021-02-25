import {
  QueryObject,
  QueryField,
  JoinArgs,
  TextArgs,
  FieldNameObject,
  UncheckedArray,
  BaseFieldType,
  IfArgs,
} from './@types';

export const isQueryObject = (item: QueryField): item is QueryObject => {
  if (item === undefined) throw new Error('Missing Query Object');
  return item !== null && item instanceof Object && !Array.isArray(item);
};

export const isQueryObjectArray = (arr: QueryField): arr is QueryObject[] =>
  arr instanceof Array && arr.every((v: QueryField) => isQueryObject(v));

export const isStringArray = (arr: QueryField): arr is string[] =>
  arr instanceof Array && arr.every((v: QueryField) => typeof v === 'string');

export const isJoinArgs = (arr: string[]): arr is JoinArgs =>
  isStringArray(arr) && arr.length === 2;

export const isStringOrFieldNameObject = (
  val: QueryField,
): val is string | FieldNameObject =>
  typeof val === 'string' ||
  (val instanceof Object &&
    !Array.isArray(val) &&
    typeof val?.$fieldName === 'string');

export const isTextArgs = (arr: QueryField[]): arr is TextArgs =>
  arr instanceof Array &&
  ((arr.length === 3 && typeof arr[2] === 'number') ||
    (arr.length === 2 &&
      (isStringOrFieldNameObject(arr[0]) || isQueryObject(arr[0])) &&
      (isStringOrFieldNameObject(arr[1]) || isQueryObject(arr[1]))));

export const allIndexesValid = (arr: UncheckedArray): arr is QueryField[] =>
  arr.every((e) => e !== undefined && e !== null);

export const isBaseField = (item: QueryField): item is BaseFieldType =>
  typeof item !== 'object' || item === null;

export const isIfArgs = (vals: QueryField): vals is IfArgs =>
  Array.isArray(vals) && isQueryObjectArray(vals) && vals.length === 3;

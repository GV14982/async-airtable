import { QueryField, QueryObject } from './@types';
import { arrayFunctions } from './arrayFunctions';
import { baseHandler } from './baseHandlers';
import { logicalFunctions } from './logicalFunctions';
import { logicalOperators } from './logicalOperators';
import { textFunctions } from './textFunctions';
import {
  allIndexesValid,
  isBaseField,
  isJoinArgs,
  isQueryObject,
  isQueryObjectArray,
  isStringArray,
  isTextArgs,
} from './typeCheckers';

export const queryBuilder = (arg: QueryField): string => {
  if (arg !== undefined && !(arg instanceof Function)) {
    if (isBaseField(arg)) {
      return baseHandler(arg);
    }

    if (arg instanceof Array) {
      const str = arg.map((a: QueryField) => queryBuilder(a)).join(', ');
      return str.trim();
    }

    const keys = Object.keys(arg);
    const vals = Object.values(arg);

    if (
      keys.length > 1 &&
      allIndexesValid(vals) &&
      isQueryObjectArray(keys.map((k, i) => ({ [k]: vals[i] })))
    ) {
      return logicalFunctions.$and(
        keys.map((k, i) => ({ [k]: vals[i] })) as QueryObject & QueryObject[],
      );
    }

    const key = keys[0];

    if (arg[key] === undefined) {
      throw new Error('Invalid query');
    }

    if (key === '$fieldName') {
      return `{${arg.$fieldName}}`;
    }

    const val = arg[key] as QueryField;
    if (val !== undefined) {
      if (
        key in logicalFunctions &&
        (isQueryObject(val) || isQueryObjectArray(val))
      ) {
        return logicalFunctions[key](val as QueryObject & QueryObject[]);
      } else if (key in arrayFunctions) {
        if (isStringArray(val) && isJoinArgs(val)) {
          return arrayFunctions[key](...val);
        } else if (typeof val === 'string') {
          return arrayFunctions[key](val);
        }
      } else if (
        key in textFunctions &&
        Array.isArray(val) &&
        isTextArgs(val)
      ) {
        return textFunctions[key](val[0], val[1], val[2] ?? 0);
      } else if (isQueryObject(val)) {
        const valKey = Object.keys(val)[0];
        const subVal = Object.values(val)[0];
        if (
          valKey in logicalOperators &&
          (isQueryObject(subVal) || isBaseField(subVal))
        ) {
          return logicalOperators[valKey]({
            [key]: subVal,
          });
        }
      } else if (isQueryObject(val) || isBaseField(val)) {
        return logicalOperators.$eq({ [key]: val });
      }
    }
  }
  throw new Error('Invalid Query Object');
};

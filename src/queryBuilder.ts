import { QueryField, QueryObject } from './@types';
import { arrayFunctions } from './arrayFunctions';
import { baseHandler } from './baseHandlers';
import {
  arrayArgFuncs,
  expressionFuncs,
  ifFunc,
  switchFunc,
} from './logicalFunctions';
import { logicalOperators } from './logicalOperators';
import { textSearchFunctions } from './textFunctions';
import {
  allIndexesValid,
  isBaseField,
  isIfArgs,
  isJoinArgs,
  isQueryObject,
  isQueryObjectArray,
  isTextSearchArgs,
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
      return arrayArgFuncs.$and(
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
      if (key in arrayArgFuncs && isQueryObjectArray(val)) {
        return arrayArgFuncs[key](val);
      } else if (key in expressionFuncs && isQueryObject(val)) {
        return expressionFuncs[key](val);
      } else if (key in ifFunc && isIfArgs(val)) {
        return ifFunc[key](val);
      } else if (key in switchFunc) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return switchFunc[key](val);
      } else if (key in arrayFunctions) {
        if (isJoinArgs(val)) {
          return arrayFunctions.$arrayJoin(val.fieldName, val.separator);
        } else if (typeof val === 'string') {
          return arrayFunctions[key](val);
        }
      } else if (key in textSearchFunctions && isTextSearchArgs(val)) {
        return textSearchFunctions[key](val);
      } else if (isQueryObject(val)) {
        const valKeys = Object.keys(val);
        const subVals = Object.values(val);

        if (
          valKeys.length > 1 &&
          allIndexesValid(subVals) &&
          isQueryObjectArray(valKeys.map((k, i) => ({ [k]: subVals[i] }))) &&
          valKeys.every((k) => k in logicalOperators) &&
          subVals.every((v) => isQueryObject(v) || isBaseField(v))
        ) {
          return arrayArgFuncs.$and(
            valKeys.map((k, i) => ({
              [key]: { [k]: subVals[i] },
            })) as QueryObject & QueryObject[],
          );
        }

        const valKey = valKeys[0];
        const subVal = subVals[0];
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
  // throw new Error('Invalid Query Object');
  return 'null';
};

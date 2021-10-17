import { QueryField, QueryObject } from './types';
import { arrayFunctions } from './arrayFunctions';
import { baseHandler } from './baseHandlers';
import { handleLogicalFunc, logicalFunctions } from './logicalFunctions';
import { logicalOperators } from './logicalOperators';
import { handleTextFunc, textFunctions } from './textFunctions';
import {
  allIndexesValid,
  isBaseField,
  isFunc,
  isJoinArgs,
  isQueryObject,
  isQueryObjectArray,
  isRegexArgs,
  isRegexReplaceArgs,
  isString,
} from './typeCheckers';
import { regexFunctions, regexReplaceFunction } from './regexFunctions';
import {
  handleNumericalFunc,
  numericalFunctions,
  numericOperators,
} from './numericFunctions';

export const operatorFunctions = {
  ...logicalOperators,
  ...numericOperators,
};

export const handleError = (arg: QueryField): Error =>
  new Error(`Invalid Query Object, ${JSON.stringify(arg)}`);

export const queryBuilder = (arg: QueryField): string => {
  if (arg !== undefined) {
    if (isFunc(arg) && !isBaseField(arg) && !isQueryObject(arg)) {
      return arg();
    }
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

    const val = arg[key];
    if (val !== undefined) {
      if (key === '$fieldName' && isString(val)) {
        return `{${val}}`;
      }

      if (key === '$insert' && isString(val)) {
        return val;
      }
      if (key in logicalFunctions) {
        return handleLogicalFunc(key, val);
      } else if (key in textFunctions) {
        return handleTextFunc(key, val);
      } else if (key in numericalFunctions) {
        return handleNumericalFunc(key, val);
      } else if (key in regexFunctions && isRegexArgs(val)) {
        return regexFunctions[key](val);
      } else if (key in regexReplaceFunction && isRegexReplaceArgs(val)) {
        return regexFunctions[key](val);
      } else if (key in arrayFunctions) {
        if (isJoinArgs(val)) {
          return arrayFunctions.$arrayJoin(val.val, val.separator);
        } else if (typeof val === 'string') {
          return arrayFunctions[key](val);
        }
      } else if (isQueryObject(val)) {
        const valKeys = Object.keys(val);
        const subVals = Object.values(val);

        if (
          valKeys.length > 1 &&
          allIndexesValid(subVals) &&
          isQueryObjectArray(valKeys.map((k, i) => ({ [k]: subVals[i] }))) &&
          subVals.every((v) => isQueryObject(v) || isBaseField(v))
        ) {
          if (valKeys.every((k) => k in logicalOperators)) {
            return logicalFunctions.$and(
              valKeys.map((k, i) => ({
                [key]: { [k]: subVals[i] },
              })),
            );
          }
          if (valKeys.every((k) => k in numericOperators)) {
            return '';
          }
        }

        const valKey = valKeys[0];
        const subVal = subVals[0];
        if (
          valKey in operatorFunctions &&
          (isQueryObject(subVal) || isBaseField(subVal))
        ) {
          return operatorFunctions[valKey]({
            [key]: subVal,
          });
        }
      } else if (isQueryObject(val) || isBaseField(val)) {
        return operatorFunctions.$eq({ [key]: val });
      }
    }
  }
  throw handleError(arg);
};

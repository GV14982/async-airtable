import { QueryField, QueryObject } from './types';
import { arrayFunctions } from './arrayFunctions';
import { baseHandler } from './baseHandlers';
import {
  arrayArgFuncs,
  expressionFuncs,
  ifFunc,
  logicalFunctions,
  switchFunc,
} from './logicalFunctions';
import { logicalOperators } from './logicalOperators';
import {
  textSearchFunctions,
  textConcatFunction,
  textMidFunction,
  textReplacementFunction,
  textSubstituteFunction,
  textDoubleArgumentFunctions,
  textSingleArgumentFunctions,
  textFunctions,
} from './textFunctions';
import {
  allIndexesValid,
  isBaseField,
  isCeilFloorArg,
  isIfArgs,
  isJoinArgs,
  isLogArg,
  isModArg,
  isNumArg,
  isNumArgArray,
  isPowerArg,
  isQueryObject,
  isQueryObjectArray,
  isRegexArgs,
  isRegexReplaceArgs,
  isRoundArg,
  isStringOrFieldNameObject,
  isSwitchArgs,
  isTextArgArray,
  isTextDoubleArg,
  isTextMidArgs,
  isTextReplaceArgs,
  isTextSearchArgs,
  isTextSubArgs,
} from './typeCheckers';
import { regexFunctions, regexReplaceFunction } from './regexFunctions';
import {
  arrayArgNumFunctions,
  ceilFloorNumFunctions,
  logNumFunction,
  modNumFunction,
  numericalFunctions,
  numericOperators,
  powerNumFunction,
  roundNumFunctions,
  singleArgNumFunctions,
} from './numericFunctions';

export const operatorFunctions = {
  ...logicalOperators,
  ...numericOperators,
};

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

    const val = arg[key];
    if (val !== undefined) {
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
          return arrayFunctions.$arrayJoin(val.fieldName, val.separator);
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
  throw new Error('Invalid Query Object');
};

const handleTextFunc = (key: string, val: QueryField): string => {
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
  throw new Error('Not a valid text function');
};

const handleLogicalFunc = (key: string, val: QueryField): string => {
  if (key in arrayArgFuncs && isQueryObjectArray(val)) {
    return arrayArgFuncs[key](val);
  } else if (key in expressionFuncs && isQueryObject(val)) {
    return expressionFuncs[key](val);
  } else if (key in ifFunc && isIfArgs(val)) {
    return ifFunc[key](val);
  } else if (key in switchFunc && isSwitchArgs(val)) {
    return switchFunc[key](val);
  }
  throw new Error('Not a valid logical function');
};

const handleNumericalFunc = (key: string, val: QueryField): string => {
  if (key in arrayArgNumFunctions && isNumArgArray(val)) {
    return arrayArgNumFunctions[key](val);
  } else if (key in singleArgNumFunctions && isNumArg(val)) {
    return singleArgNumFunctions[key](val);
  } else if (key in ceilFloorNumFunctions && isCeilFloorArg(val)) {
    return ceilFloorNumFunctions[key](val);
  } else if (key in logNumFunction && isLogArg(val)) {
    return logNumFunction[key](val);
  } else if (key in modNumFunction && isModArg(val)) {
    return modNumFunction[key](val);
  } else if (key in powerNumFunction && isPowerArg(val)) {
    return powerNumFunction[key](val);
  } else if (key in roundNumFunctions && isRoundArg(val)) {
    return roundNumFunctions[key](val);
  }
  throw new Error('Not a valid logical function');
};

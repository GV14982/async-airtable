import {
  QueryObject,
  LogicalOperators,
  QueryField,
  BaseFieldType,
  ComparisonObject,
  ArrayArg,
  FieldNameObject,
  TextArg,
  LogicalFunctions,
} from './@types';

const operators = ['=', '!=', '>', '>=', '<', '<='];
const baseTypes = ['string', 'number', 'boolean', 'null'];

export const isQueryObject = (item: QueryField): boolean => {
  if (item === undefined) throw new Error('Missing Query Object');
  const types = ['string', 'number', 'boolean'];
  return item !== null && !types.includes(typeof item);
};

export const buildExpression = (obj: ComparisonObject, op: string): string => {
  if (typeof obj !== 'object' || Array.isArray(obj))
    throw new Error('Missing or Invalid Comparison Object');
  if (typeof op !== 'string' && !operators.includes(op))
    throw new Error('Missing or Invalid Comparison Operator');
  const keys = Object.keys(obj);
  const expressionMapper = (k: string, i: number) => {
    const val = queryBuilder(obj[k]);
    return `{${k}} ${op} ${val}${i < keys.length - 1 ? ', ' : ''}`;
  };

  const exp = `${keys.map(expressionMapper).join('')}`;
  return keys.length > 1 ? `AND(${exp})` : exp;
};

export const arrayMethods = {
  $arrayCompact: (arg: string): string => {
    return `ARRAYCOMPACT({${arg}})`;
  },
  $arrayFlatten: (arg: string): string => {
    return `ARRAYFLATTEN({${arg}})`;
  },
  $arrayJoin: (arg: string, seperator = ','): string => {
    return `ARRAYJOIN({${arg}}, '${seperator}')`;
  },
  $arrayUnique: (arg: string): string => {
    return `ARRAYUNIQUE({${arg}})`;
  },
};

export const textMethods = {
  $stringFind: (
    search: FieldNameObject | string,
    set: FieldNameObject | string,
    startIndex = 0,
  ): string =>
    `FIND(${
      typeof search === 'string' ? baseHandler(search) : queryBuilder(search)
    }, ${
      typeof set === 'string' ? baseHandler(set) : queryBuilder(set)
    }, ${startIndex})`,
  $stringSearch: (
    search: FieldNameObject | string,
    set: FieldNameObject | string,
    startIndex = 0,
  ): string =>
    `SEARCH(${
      typeof search === 'string' ? baseHandler(search) : queryBuilder(search)
    }, ${
      typeof set === 'string' ? baseHandler(set) : queryBuilder(set)
    }, ${startIndex})`,
};

export const logicalOperators: LogicalOperators = {
  $gt: (val) => {
    return buildExpression(val, '>');
  },
  $lt: (val) => {
    return buildExpression(val, '<');
  },
  $gte: (val) => {
    return buildExpression(val, '>=');
  },
  $lte: (val) => {
    return buildExpression(val, '<=');
  },
  $eq: (val) => {
    return buildExpression(val, '=');
  },
  $neq: (val) => {
    return buildExpression(val, '!=');
  },
};

export const logicalFunctions: LogicalFunctions = {
  $not: (expression: QueryObject) => `NOT(${queryBuilder(expression)})`,
  $and: (args: QueryObject[]) => {
    let str = 'AND(';
    args.forEach((arg, i) => {
      str += queryBuilder(arg);
      if (i < args.length - 1) {
        str += ', ';
      }
    });
    return str + ')';
  },
  $or: (args: QueryObject[]) => {
    let str = 'OR(';
    args.forEach((arg, i) => {
      str += queryBuilder(arg);
      if (i < args.length - 1) {
        str += ', ';
      }
    });
    return str + ')';
  },
};

export const booleanHandler = (bool: boolean): string => {
  if (typeof bool !== 'boolean') {
    throw new Error('Invalid type');
  }
  return bool ? 'TRUE()' : 'FALSE()';
};

export const baseHandler = (val: BaseFieldType): string => {
  if (val === null) {
    return 'BLANK()';
  }
  switch (typeof val) {
    case 'number':
      return `${val}`;
    case 'string':
      return `'${val}'`;
    case 'boolean':
      return booleanHandler(val);
    default:
      throw new Error('Wrong Type');
  }
};

const queryBuilder = (query: QueryField): string => {
  let formulaString = '';
  if (baseTypes.includes(typeof query)) {
    formulaString += baseHandler(query as BaseFieldType);
  }
  if (query && typeof query === 'object') {
    if (query && typeof query === 'object' && '$fieldName' in query) {
      formulaString += `{${query.$fieldName}}`;
    } else {
      if (Object.keys(query as Record<string, QueryField>).length > 1) {
        formulaString += logicalFunctions.$and(
          Object.keys(query).map((k) => ({ [k]: query[k] })),
        );
      } else {
        for (const key in query) {
          const current = query[key];

          if (
            key in logicalOperators &&
            isQueryObject(current as QueryObject)
          ) {
            formulaString += logicalOperators[key](
              current as Record<string, number>,
            );
          } else if (
            key in logicalFunctions &&
            (isQueryObject(current as QueryObject) || Array.isArray(current))
          ) {
            formulaString += logicalFunctions[key](
              current as QueryObject & QueryObject[],
            );
          } else if (
            key in arrayMethods &&
            Array.isArray(current) &&
            current.length > 0
          ) {
            formulaString += arrayMethods[key as keyof typeof arrayMethods](
              ...(current as ArrayArg),
            );
          } else if (
            key in textMethods &&
            Array.isArray(current) &&
            current.length > 0
          ) {
            formulaString += textMethods[key as keyof typeof textMethods](
              ...(current as TextArg),
            );
          } else if (key === '$fieldName' && typeof current === 'string') {
            formulaString += `{${current}}`;
          } else {
            formulaString += buildExpression(
              query as Record<string, BaseFieldType>,
              '=',
            );
          }
        }
      }
    }
  } else {
    throw new Error('Invalid query');
  }
  return formulaString;
};

export default queryBuilder;

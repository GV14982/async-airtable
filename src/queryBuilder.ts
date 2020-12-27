import {
  NumericalOperators,
  QueryObject,
  LogicalOperators,
  QueryField,
  BaseFieldType,
  ComparisonObject,
} from './@types';

const operators = ['=', '!=', '>', '>=', '<', '<='];

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
    const val = baseHandler(obj[k]);
    return `{${k}} ${op} ${val}${i < keys.length - 1 ? ', ' : ''}`;
  };

  const exp = `${keys.map(expressionMapper).join('')}`;
  return keys.length > 1 ? `AND(${exp})` : exp;
};

export const numericalOperators: NumericalOperators = {
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

export const logicalOperators: LogicalOperators = {
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

export const baseHandler = (val: string | number | boolean | null): string => {
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

const queryBuilder = (query: QueryObject): string => {
  let formulaString = '';
  if (Object.keys(query as Record<string, QueryField>).length > 1) {
    formulaString += logicalOperators.$and(
      Object.keys(query).map((k) => ({ [k]: query[k] })),
    );
  } else {
    for (const key in query) {
      const current = query[key];

      if (key in numericalOperators && isQueryObject(current as QueryObject)) {
        formulaString += numericalOperators[key](
          current as Record<string, number>,
        );
      } else if (
        key in logicalOperators &&
        (isQueryObject(current as QueryObject) || Array.isArray(current))
      ) {
        formulaString += logicalOperators[key](
          current as QueryObject & QueryObject[],
        );
      } else {
        formulaString += buildExpression(
          query as Record<string, BaseFieldType>,
          '=',
        );
      }
    }
  }
  return formulaString;
};

export default queryBuilder;

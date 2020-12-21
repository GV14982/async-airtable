import {
  NumericalOperators,
  QueryObject,
  LogicalOperators,
  QueryField,
  BaseFieldType,
  ComparisonObject,
} from './@types';

const isQueryObject = (item: QueryField) => {
  const types = ['string', 'number', 'boolean'];
  return item !== null && !types.includes(typeof item);
};

const buildExpression = (obj: ComparisonObject, op: string) => {
  const keys = Object.keys(obj);
  const expressionMapper = (k: string, i: number) => {
    const val = baseHandler(obj[k]);
    return `{${k}} ${op} ${val}${i < keys.length - 1 ? ', ' : ''}`;
  };

  const exp = `${keys.map(expressionMapper).join('')}`;
  return keys.length > 1 ? `AND(${exp})` : exp;
};

const numericalOperators: NumericalOperators = {
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

const logicalOperators: LogicalOperators = {
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

const booleanHandler = (bool: boolean) => {
  if (typeof bool !== 'boolean') {
    throw new Error('Invalid type');
  }
  return bool ? 'TRUE()' : 'FALSE()';
};

const baseHandler = (val: string | number | boolean | null) => {
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

export const queryBuilder = (query: QueryObject): string => {
  let formulaString = '';
  if (Object.keys(query as Record<string, QueryField>).length > 1) {
    formulaString += logicalOperators.$and(
      Object.keys(query).map((k) => ({ [k]: query[k] })),
    );
  } else {
    for (const key in query) {
      const current = query[key];

      if (key in numericalOperators && isQueryObject(current)) {
        formulaString += numericalOperators[key](
          current as Record<string, number>,
        );
      } else if (key in logicalOperators && isQueryObject(current)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formulaString += logicalOperators[key](current);
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

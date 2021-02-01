import { LogicalOperators } from './../@types';
import buildOpts from '../buildOpts';
import checkArg from '../checkArg';
import checkError from '../checkError';
// import rateLimitHandler from '../rateLimitHandler';

import queryBuilder, {
  buildExpression,
  isQueryObject,
  logicalOperators,
  logicalFunctions,
  arrayMethods,
  textMethods,
} from '../queryBuilder';

const operators = [
  { $eq: '=' },
  { $neq: '!=' },
  { $gt: '>' },
  { $gte: '>=' },
  { $lt: '<' },
  { $lte: '<=' },
];

describe('Helper Functions', () => {
  describe('Query Builder', () => {
    describe('isQueryObject', () => {
      test('should return true if the passed object is of type QueryObject', () => {
        expect(
          isQueryObject({
            $or: [{ name: 'fred' }, { lt$: { coins: 10 } }],
          }),
        ).toBe(true);

        expect(
          isQueryObject({
            email: null,
          }),
        ).toBe(true);
      });

      test('should return false if the passed object is of type a string, number, boolean, or null', () => {
        expect(isQueryObject('NotQueryObject')).toBe(false);
        expect(isQueryObject(10)).toBe(false);
        expect(isQueryObject(true)).toBe(false);
        expect(isQueryObject(null)).toBe(false);
      });

      test('should throw an error if passed an undefined value', () => {
        expect(() => {
          //@ts-ignore
          isQueryObject(undefined);
        }).toThrow('Missing Query Object');
      });
    });

    describe('buildExpression', () => {
      test('should return a string when passed in a numerical expression', () => {
        expect(buildExpression({ email: 'test@test.com' }, '=')).toBe(
          "{email} = 'test@test.com'",
        );
      });

      test('should throw an error if you pass an incorrect value for the comparison object', () => {
        expect(() => {
          //@ts-ignore
          buildExpression(['false'], '=');
        }).toThrow('Missing or Invalid Comparison Object');
      });

      test('should throw an error if you pass an incorrect value for the comparison operator', () => {
        expect(() => {
          //@ts-ignore
          buildExpression({ email: 'test@test.com' }, false);
        }).toThrow('Missing or Invalid Comparison Operator');
      });
    });

    describe('Logical Operators', () => {
      operators.forEach((op) => {
        test(`should return a string with the correct comparison operator: ${
          Object.values(op)[0]
        } for ${Object.keys(op)[0]}`, () => {
          expect(logicalOperators[Object.keys(op)[0]]({ field: 10 })).toBe(
            `{field} ${Object.values(op)[0]} 10`,
          );
        });
      });
    });

    describe('Logical Functions', () => {
      test('Should return a string wrapped in a NOT function', () => {
        expect(logicalFunctions.$not({ field: 'value', otherField: 10 })).toBe(
          "NOT(AND({field} = 'value', {otherField} = 10))",
        );
      });

      test('Should return a string wrapped in an AND function', () => {
        expect(
          logicalFunctions.$and([{ $lt: { coins: 10 } }, { name: 'fred' }]),
        ).toBe("AND({coins} < 10, {name} = 'fred')");
      });

      test('Should return a string wrapped in an OR function', () => {
        expect(
          logicalFunctions.$or([{ $lt: { coins: 10 } }, { name: 'fred' }]),
        ).toBe("OR({coins} < 10, {name} = 'fred')");
      });
    });

    describe('Array Methods', () => {
      test('should return the string with the specified method', () => {
        expect(arrayMethods.$arrayCompact('test')).toBe('ARRAYCOMPACT({test})');
        expect(arrayMethods.$arrayFlatten('test')).toBe('ARRAYFLATTEN({test})');
        expect(arrayMethods.$arrayUnique('test')).toBe('ARRAYUNIQUE({test})');
        expect(arrayMethods.$arrayJoin('test', ',')).toBe(
          "ARRAYJOIN({test}, ',')",
        );
      });
    });

    describe('String Methods', () => {
      test('should return a string with the specified method', () => {
        expect(textMethods.$stringFind('test', 'test')).toBe(
          "FIND('test', {test}, 0)",
        );

        expect(textMethods.$stringSearch('test', 'test')).toBe(
          "SEARCH('test', {test}, 0)",
        );
      });
    });

    describe('queryBuilder', () => {
      test('should return a filter formula string from a query object', () => {
        expect(queryBuilder({ field: 'value' })).toBe("{field} = 'value'");
        operators.forEach((op) => {
          expect(queryBuilder({ [Object.keys(op)[0]]: { field: 10 } })).toBe(
            `{field} ${Object.values(op)[0]} 10`,
          );
        });
        expect(queryBuilder({ $not: { field: 'value' } })).toBe(
          "NOT({field} = 'value')",
        );
        expect(
          queryBuilder({ $and: [{ field: 'value' }, { otherField: 'value' }] }),
        ).toBe("AND({field} = 'value', {otherField} = 'value')");
        expect(
          queryBuilder({ $or: [{ field: 'value' }, { otherField: 'value' }] }),
        ).toBe("OR({field} = 'value', {otherField} = 'value')");
      });
    });
  });

  describe('buildOpts', () => {
    test('should return a URI encoded string from an object of select options', () => {
      expect(
        buildOpts({
          fields: ['name', 'email', 'date'],
          filterByFormula: "{name} = 'Paul'",
          maxRecords: 50,
          pageSize: 10,
          sort: [
            {
              field: 'name',
              direction: 'desc',
            },
            {
              field: 'date',
              direction: 'asc',
            },
          ],
          view: 'Grid view',
        }),
      ).toBe(
        "fields%5B%5D=name&fields%5B%5D=email&fields%5B%5D=date&filterByFormula=%7Bname%7D%20=%20'Paul'&maxRecords=50&pageSize=10&sort%5B0%5D%5Bfield%5D=name&sort%5B0%5D%5Bdirection%5D=desc&sort%5B1%5D%5Bfield%5D=date&sort%5B1%5D%5Bdirection%5D=asc&view=Grid%20view",
      );

      expect(
        buildOpts({
          fields: ['name', 'email', 'date'],
          where: { name: 'Paul' },
          maxRecords: 50,
          pageSize: 10,
          sort: [
            {
              field: 'name',
              direction: 'desc',
            },
            {
              field: 'date',
              direction: 'asc',
            },
          ],
          view: 'Grid view',
        }),
      ).toBe(
        "fields%5B%5D=name&fields%5B%5D=email&fields%5B%5D=date&filterByFormula=%7Bname%7D%20=%20'Paul'&maxRecords=50&pageSize=10&sort%5B0%5D%5Bfield%5D=name&sort%5B0%5D%5Bdirection%5D=desc&sort%5B1%5D%5Bfield%5D=date&sort%5B1%5D%5Bdirection%5D=asc&view=Grid%20view",
      );
    });

    test('should throw an error if both filterByFormula and where are used', () => {
      expect(() => {
        buildOpts({
          where: { field: 'value' },
          filterByFormula: '',
        });
      }).toThrow(
        'Cannot use both where and filterByFormula as they accomplish the same thing',
      );
    });
  });

  describe('checkArgs', () => {
    test('should not throw an error if the argument is passed and matches the type', () => {
      expect(checkArg('test', 'test', 'string')).toBeUndefined();
      expect(checkArg(10, 'test', 'number')).toBeUndefined();
      expect(checkArg(['test'], 'test', 'array')).toBeUndefined();
      expect(checkArg({ pageSize: 10 }, 'test', 'object')).toBeUndefined();
      expect(checkArg(undefined, 'test', 'object', false)).toBeUndefined();
    });

    test('should throw an error if the argument is undefined and required or the wrong type', () => {
      expect(() => {
        //@ts-ignore
        checkArg(undefined, 'test', 'string');
      }).toThrow(/Argument .+ is required/);

      expect(() => {
        //@ts-ignore
        checkArg(10, 'test', 'string');
      }).toThrow(
        /Incorrect data type on argument .+\. Received .+: expected .+/,
      );
    });
  });

  describe('checkErrors', () => {
    test('should return a boolean denoting if the status is in the 200 range', () => {
      expect(checkError(200)).toBe(false);
      expect(checkError(300)).toBe(true);
    });
  });
});

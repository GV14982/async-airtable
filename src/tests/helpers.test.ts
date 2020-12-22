import buildOpts from '../buildOpts';
import checkArg from '../checkArg';
import checkError from '../checkError';
import rateLimitHandler from '../rateLimitHandler';

import queryBuilder, {
  buildExpression,
  isQueryObject,
  logicalOperators,
  numericalOperators,
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
      it('should return true if the passed object is of type QueryObject', () => {
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

      it('should return false if the passed object is of type a string, number, boolean, or null', () => {
        expect(isQueryObject('NotQueryObject')).toBe(false);
        expect(isQueryObject(10)).toBe(false);
        expect(isQueryObject(true)).toBe(false);
        expect(isQueryObject(null)).toBe(false);
      });

      it('should throw an error if passed an undefined value', () => {
        expect(() => {
          //@ts-ignore
          isQueryObject(undefined);
        }).toThrow('Missing Query Object');
      });
    });

    describe('buildExpression', () => {
      it('should return a string when passed in a numerical expression', () => {
        expect(buildExpression({ email: 'test@test.com' }, '=')).toBe(
          "{email} = 'test@test.com'",
        );
      });

      it('should throw an error if you pass an incorrect value for the comparison object', () => {
        expect(() => {
          //@ts-ignore
          buildExpression(['false'], '=');
        }).toThrow('Missing or Invalid Comparison Object');
      });

      it('should throw an error if you pass an incorrect value for the comparison operator', () => {
        expect(() => {
          //@ts-ignore
          buildExpression({ email: 'test@test.com' }, false);
        }).toThrow('Missing or Invalid Comparison Operator');
      });
    });

    describe('NumericalOperators', () => {
      operators.forEach((op) => {
        it(`should return a string with the correct comparison operator: ${
          Object.values(op)[0]
        } for ${Object.keys(op)[0]}`, () => {
          expect(numericalOperators[Object.keys(op)[0]]({ field: 10 })).toBe(
            `{field} ${Object.values(op)[0]} 10`,
          );
        });
      });
    });

    describe('Logical Operators', () => {
      it('Should return a string wrapped in a NOT function', () => {
        expect(logicalOperators.$not({ field: 'value', otherField: 10 })).toBe(
          "NOT(AND({field} = 'value', {otherField} = 10))",
        );
      });

      it('Should return a string wrapped in an AND function', () => {
        expect(
          logicalOperators.$and([{ $lt: { coins: 10 } }, { name: 'fred' }]),
        ).toBe("AND({coins} < 10, {name} = 'fred')");
      });

      it('Should return a string wrapped in an OR function', () => {
        expect(
          logicalOperators.$or([{ $lt: { coins: 10 } }, { name: 'fred' }]),
        ).toBe("OR({coins} < 10, {name} = 'fred')");
      });
    });

    describe('queryBuilder', () => {
      it('should return a filter formula string from a query object', () => {
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
    it('should return a URI encoded string from an object of select options', () => {
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

    it('should throw an error if both filterByFormula and where are used', () => {
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
    it('should not throw an error if the argument is passed and matches the type', () => {
      expect(checkArg('test', 'test', 'string')).toBeUndefined();
      expect(checkArg(10, 'test', 'number')).toBeUndefined();
      expect(checkArg(['test'], 'test', 'array')).toBeUndefined();
      expect(checkArg({ pageSize: 10 }, 'test', 'object')).toBeUndefined();
      expect(checkArg(undefined, 'test', 'object', false)).toBeUndefined();
    });

    it('should throw an error if the argument is undefined and required or the wrong type', () => {
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
    it('should return a boolean denoting if the status is in the 200 range', () => {
      expect(checkError(200)).toBe(false);
      expect(checkError(300)).toBe(true);
    });
  });
});

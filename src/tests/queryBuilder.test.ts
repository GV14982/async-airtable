import {
  ERROR,
  CREATED_TIME,
  RECORD_ID,
  NOW,
  TODAY,
  LAST_MODIFIED_TIME,
} from '../asyncAirtable';
import { operatorFunctions, queryBuilder } from '../queryBuilder';
import { arrayFunctions } from '../arrayFunctions';
import { buildExpression, operators } from '../buildExpression';
import {
  arrayArgFuncs,
  expressionFuncs,
  ifFunc,
  switchFunc,
} from '../logicalFunctions';
import {
  textSearchFunctions,
  textConcatFunction,
  textMidFunction,
  textReplacementFunction,
  textSubstituteFunction,
  textDoubleArgumentFunctions,
  textSingleArgumentFunctions,
} from '../textFunctions';
import { isQueryObject } from '../typeCheckers';
import { regexFunctions, regexReplaceFunction } from '../regexFunctions';
import {
  arrayArgNumFunctions,
  ceilFloorNumFunctions,
  logNumFunction,
  modNumFunction,
  powerNumFunction,
  roundNumFunctions,
  singleArgNumFunctions,
} from '../numericFunctions';
import {
  dateAddFunc,
  dateDiffFunc,
  dateFormatFunc,
  dateParseFunc,
  dateSameFunc,
  dateWeekFuncs,
  dateWorkDayDiffFunc,
  dateWorkDayFunc,
  lastModifiedFunc,
  singleArgDateFuncs,
} from '../dateFunctions';

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
    test('should return a string when passed in a logical expression', () => {
      expect(buildExpression({ email: 'test@test.com' }, '=')).toBe(
        "{email} = 'test@test.com'",
      );
    });

    test('should return an AND string when passed in multiple logical expressions', () => {
      expect(buildExpression({ coins: 10, test: 20 }, '>=')).toBe(
        'AND({coins} >= 10, {test} >= 20)',
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

  describe('Operators', () => {
    operators.forEach((op) => {
      test(`should return a string with the correct operator: ${
        Object.values(op)[0]
      } for ${Object.keys(op)[0]}`, () => {
        expect(operatorFunctions[Object.keys(op)[0]]({ field: 10 })).toBe(
          `{field} ${Object.values(op)[0]} 10`,
        );
      });
    });
  });

  describe('Logical Functions', () => {
    test('Should return a string wrapped in a NOT function', () => {
      expect(
        //@ts-ignore
        expressionFuncs.$not({
          field: 'value',
          otherField: 10,
        }),
      ).toBe("NOT(AND({field} = 'value', {otherField} = 10))");
    });

    test('Should return a string wrapped in an AND function', () => {
      expect(
        //@ts-ignore
        arrayArgFuncs.$and([{ coins: { $lt: 10 } }, { name: 'fred' }]),
      ).toBe("AND({coins} < 10, {name} = 'fred')");
    });

    test('Should return a string wrapped in an OR function', () => {
      expect(
        //@ts-ignore
        arrayArgFuncs.$or([{ coins: { $lt: 10 } }, { name: 'fred' }]),
      ).toBe("OR({coins} < 10, {name} = 'fred')");
    });

    test('Should return a string wrapped in an XOR function', () => {
      expect(
        //@ts-ignore
        arrayArgFuncs.$xor([{ coins: { $lt: 10 } }, { name: 'fred' }]),
      ).toBe("XOR({coins} < 10, {name} = 'fred')");
    });

    test('Should return an isError function', () => {
      expect(
        //@ts-ignore
        expressionFuncs.$isError({ coins: { $lt: 10 } }),
      ).toBe('ISERROR({coins} < 10)');
    });

    test('Should return a string wrapped in an IF function', () => {
      expect(
        ifFunc.$if({
          expression: { coins: { $lt: 10 } },
          ifTrue: 'poor',
          ifFalse: 'rich',
        }),
      ).toBe("IF({coins} < 10, 'poor', 'rich')");
    });

    test('should return a string wrapped in a SWITCH function', () => {
      expect(
        switchFunc.$switch({
          expression: { $fieldName: 'coins' },
          cases: [
            {
              switchCase: 9,
              val: 'nine',
            },
            {
              switchCase: 10,
              val: 'ten',
            },
            {
              switchCase: 11,
              val: 'eleven',
            },
          ],
          defaultVal: null,
        }),
      ).toBe("SWITCH({coins}, 9, 'nine', 10, 'ten', 11, 'eleven', BLANK())");
    });
  });

  describe('Array Functions', () => {
    test('should return the string with the specified method', () => {
      expect(arrayFunctions.$arrayCompact({ $fieldName: 'test' })).toBe(
        'ARRAYCOMPACT({test})',
      );
      expect(arrayFunctions.$arrayFlatten({ $fieldName: 'test' })).toBe(
        'ARRAYFLATTEN({test})',
      );
      expect(arrayFunctions.$arrayUnique({ $fieldName: 'test' })).toBe(
        'ARRAYUNIQUE({test})',
      );
      expect(arrayFunctions.$arrayJoin({ $fieldName: 'test' })).toBe(
        "ARRAYJOIN({test}, ',')",
      );
    });
  });

  describe('Text Functions', () => {
    test('should return a string with the specified method', () => {
      expect(
        textSearchFunctions.$find({
          stringToFind: { $fieldName: 'test' },
          whereToSearch: 'test',
        }),
      ).toBe("FIND({test}, 'test', 0)");
      expect(
        textSearchFunctions.$search({
          stringToFind: { $fieldName: 'test' },
          whereToSearch: 'test',
        }),
      ).toBe("SEARCH({test}, 'test', 0)");
      expect(
        textSearchFunctions.$find({
          stringToFind: 'test',
          whereToSearch: { $fieldName: 'test' },
        }),
      ).toBe("FIND('test', {test}, 0)");
      expect(
        textSearchFunctions.$search({
          stringToFind: 'test',
          whereToSearch: { $fieldName: 'test' },
        }),
      ).toBe("SEARCH('test', {test}, 0)");
      expect(
        textSearchFunctions.$find({
          stringToFind: 'test',
          whereToSearch: 'test',
          index: 2,
        }),
      ).toBe("FIND('test', 'test', 2)");
      expect(
        textSearchFunctions.$search({
          stringToFind: 'test',
          whereToSearch: 'test',
          index: 2,
        }),
      ).toBe("SEARCH('test', 'test', 2)");
      expect(textConcatFunction.$concatenate(['test', 'test'])).toBe(
        "CONCATENATE('test', 'test')",
      );
      expect(
        textConcatFunction.$concatenate([{ $fieldName: 'test' }, 'test']),
      ).toBe("CONCATENATE({test}, 'test')");
      expect(
        textMidFunction.$mid({ text: 'test', whereToStart: 1, num: 2 }),
      ).toBe("MID('test', 1, 2)");
      expect(
        textMidFunction.$mid({
          text: { $fieldName: 'test' },
          whereToStart: 1,
          num: 2,
        }),
      ).toBe('MID({test}, 1, 2)');
      expect(
        textReplacementFunction.$replace({
          text: 'test',
          startChar: 2,
          numChars: 1,
          replacement: 'x',
        }),
      ).toBe("REPLACE('test', 2, 1, 'x')");
      expect(
        textSubstituteFunction.$substitute({
          text: 'test',
          oldText: 's',
          newText: 'x',
        }),
      ).toBe("SUBSTITUTE('test', 's', 'x', 0)");
      expect(
        textSubstituteFunction.$substitute({
          text: 'test',
          oldText: 's',
          newText: 'x',
          index: 2,
        }),
      ).toBe("SUBSTITUTE('test', 's', 'x', 2)");
      expect(textDoubleArgumentFunctions.$left({ text: 'test', num: 2 })).toBe(
        "LEFT('test', 2)",
      );
      expect(textDoubleArgumentFunctions.$right({ text: 'test', num: 2 })).toBe(
        "RIGHT('test', 2)",
      );
      expect(textDoubleArgumentFunctions.$rept({ text: 'test', num: 2 })).toBe(
        "REPT('test', 2)",
      );
      expect(textSingleArgumentFunctions.$encodeUrlComponent('test')).toBe(
        "ENCODE_URL_COMPONENT('test')",
      );
      expect(textSingleArgumentFunctions.$len('test')).toBe("LEN('test')");
      expect(textSingleArgumentFunctions.$lower('test')).toBe("LOWER('test')");
      expect(textSingleArgumentFunctions.$trim('test')).toBe("TRIM('test')");
      expect(textSingleArgumentFunctions.$upper('test')).toBe("UPPER('test')");
    });
  });

  describe('Regex Functions', () => {
    expect(regexFunctions.$regexExtract({ text: 'test', regex: 't.*t' })).toBe(
      "REGEX_EXTRACT('test', 't.*t')",
    );
    expect(regexFunctions.$regexMatch({ text: 'test', regex: 't.*t' })).toBe(
      "REGEX_MATCH('test', 't.*t')",
    );
    expect(
      regexReplaceFunction.$regexReplace({
        text: 'test',
        regex: '.s',
        replacement: 'ex',
      }),
    ).toBe("REGEX_REPLACE('test', '.s', 'ex')");
  });

  describe('Numeric functions', () => {
    test('should return the correct string for the numeric function', () => {
      expect(singleArgNumFunctions.$abs(10)).toBe('ABS(10)');
      expect(singleArgNumFunctions.$even(10)).toBe('EVEN(10)');
      expect(singleArgNumFunctions.$exp(10)).toBe('EXP(10)');
      expect(singleArgNumFunctions.$int(10)).toBe('INT(10)');
      expect(singleArgNumFunctions.$odd(10)).toBe('ODD(10)');
      expect(singleArgNumFunctions.$sqrt(10)).toBe('SQRT(10)');

      expect(arrayArgNumFunctions.$avg([10, 11])).toBe('AVERAGE(10, 11)');
      expect(arrayArgNumFunctions.$count([10, 11])).toBe('COUNT(10, 11)');
      expect(arrayArgNumFunctions.$counta([10, 11])).toBe('COUNTA(10, 11)');
      expect(arrayArgNumFunctions.$countAll([10, 11])).toBe('COUNTALL(10, 11)');
      expect(arrayArgNumFunctions.$max([10, 11])).toBe('MAX(10, 11)');
      expect(arrayArgNumFunctions.$min([10, 11])).toBe('MIN(10, 11)');
      expect(arrayArgNumFunctions.$sum([10, 11])).toBe('SUM(10, 11)');

      expect(ceilFloorNumFunctions.$ceil({ val: 10 })).toBe('CEILING(10, 1)');
      expect(ceilFloorNumFunctions.$ceil({ val: 10, significance: 2 })).toBe(
        'CEILING(10, 2)',
      );
      expect(ceilFloorNumFunctions.$floor({ val: 10 })).toBe('FLOOR(10, 1)');
      expect(ceilFloorNumFunctions.$floor({ val: 10, significance: 2 })).toBe(
        'FLOOR(10, 2)',
      );

      expect(logNumFunction.$log({ num: 10 })).toBe('LOG(10, 10)');
      expect(logNumFunction.$log({ num: 10, base: 2 })).toBe('LOG(10, 2)');

      expect(modNumFunction.$mod({ val: 10, divisor: 2 })).toBe('MOD(10, 2)');
      expect(powerNumFunction.$pow({ base: 10, power: 2 })).toBe(
        'POWER(10, 2)',
      );

      expect(roundNumFunctions.$round({ val: 10, precision: 1 })).toBe(
        'ROUND(10, 1)',
      );
      expect(roundNumFunctions.$roundDown({ val: 10, precision: 1 })).toBe(
        'ROUNDDOWN(10, 1)',
      );
      expect(roundNumFunctions.$roundUp({ val: 10, precision: 1 })).toBe(
        'ROUNDUP(10, 1)',
      );
    });
  });

  describe('Date Functions', () => {
    test('should return a correct string for date function', () => {
      expect(singleArgDateFuncs.$dateStr({ $fieldName: 'date' })).toBe(
        'DATESTR({date})',
      );
      expect(singleArgDateFuncs.$day({ $fieldName: 'date' })).toBe(
        'DAY({date})',
      );
      expect(singleArgDateFuncs.$fromNow({ $fieldName: 'date' })).toBe(
        'FROMNOW({date})',
      );
      expect(singleArgDateFuncs.$hour({ $fieldName: 'date' })).toBe(
        'HOUR({date})',
      );
      expect(singleArgDateFuncs.$minute({ $fieldName: 'date' })).toBe(
        'MINUTE({date})',
      );
      expect(singleArgDateFuncs.$month({ $fieldName: 'date' })).toBe(
        'MONTH({date})',
      );
      expect(singleArgDateFuncs.$second({ $fieldName: 'date' })).toBe(
        'SECOND({date})',
      );
      expect(singleArgDateFuncs.$timeStr({ $fieldName: 'date' })).toBe(
        'TIMESTR({date})',
      );
      expect(singleArgDateFuncs.$toNow({ $fieldName: 'date' })).toBe(
        'TONOW({date})',
      );
      expect(singleArgDateFuncs.$year({ $fieldName: 'date' })).toBe(
        'YEAR({date})',
      );
      expect(
        dateAddFunc.$dateAdd({
          date: { $fieldName: 'date' },
          count: 10,
          units: 'days',
        }),
      ).toBe("DATEADD({date}, 10, 'days')");
      expect(
        dateDiffFunc.$dateDiff({
          date1: { $fieldName: 'date1' },
          date2: { $fieldName: 'date2' },
          units: 'days',
        }),
      ).toBe("DATETIME_DIFF({date1}, {date2}, 'days')");
      expect(
        dateSameFunc.$dateSame({
          date1: { $fieldName: 'date1' },
          date2: { $fieldName: 'date2' },
          units: 'days',
        }),
      ).toBe("IS_SAME({date1}, {date2}, 'days')");
      expect(
        dateSameFunc.$dateSame({
          date1: { $fieldName: 'date1' },
          date2: { $fieldName: 'date2' },
        }),
      ).toBe('IS_SAME({date1}, {date2})');
      expect(
        dateFormatFunc.$dateFormat({
          date: { $fieldName: 'date' },
          format: 'YYYY-MM-DD',
        }),
      ).toBe("DATETIME_FORMAT({date}, 'YYYY-MM-DD')");
      expect(dateFormatFunc.$dateFormat({ date: { $fieldName: 'date' } })).toBe(
        'DATETIME_FORMAT({date})',
      );
      expect(
        dateParseFunc.$dateParse({
          date: { $fieldName: 'date' },
          format: 'YYYY-MM-DD',
          locale: 'es',
        }),
      ).toBe("DATETIME_PARSE({date}, 'YYYY-MM-DD', 'es')");
      expect(
        dateParseFunc.$dateParse({
          date: { $fieldName: 'date' },
          format: 'YYYY-MM-DD',
        }),
      ).toBe("DATETIME_PARSE({date}, 'YYYY-MM-DD')");
      expect(
        dateParseFunc.$dateParse({
          date: { $fieldName: 'date' },
        }),
      ).toBe('DATETIME_PARSE({date})');
      expect(
        dateWeekFuncs.$weekDay({
          date: { $fieldName: 'date' },
          start: 'Monday',
        }),
      ).toBe("WEEKDAY({date}, 'Monday')");
      expect(dateWeekFuncs.$weekDay({ date: { $fieldName: 'date' } })).toBe(
        'WEEKDAY({date})',
      );
      expect(
        dateWeekFuncs.$weekNum({
          date: { $fieldName: 'date' },
          start: 'Monday',
        }),
      ).toBe("WEEKNUM({date}, 'Monday')");
      expect(dateWeekFuncs.$weekNum({ date: { $fieldName: 'date' } })).toBe(
        'WEEKNUM({date})',
      );
      expect(
        dateWorkDayFunc.$workDay({
          date: { $fieldName: 'date' },
          numDays: 10,
          holidays: ['10/30/21'],
        }),
      ).toBe("WORKDAY({date}, 10, '10/30/21')");
      expect(
        dateWorkDayFunc.$workDay({
          date: { $fieldName: 'date' },
          numDays: 10,
          holidays: ['10/30/21', '11/19/21'],
        }),
      ).toBe("WORKDAY({date}, 10, '10/30/21', '11/19/21')");
      expect(
        dateWorkDayFunc.$workDay({
          date: { $fieldName: 'date' },
          numDays: 10,
        }),
      ).toBe('WORKDAY({date}, 10)');
      expect(
        dateWorkDayDiffFunc.$workDayDiff({
          date1: { $fieldName: 'date1' },
          date2: { $fieldName: 'date2' },
          holidays: ['10/30/21'],
        }),
      ).toBe("WORKDAY_DIFF({date1}, {date2}, '10/30/21')");
      expect(
        dateWorkDayDiffFunc.$workDayDiff({
          date1: { $fieldName: 'date1' },
          date2: { $fieldName: 'date2' },
          holidays: ['10/30/21', '11/19/21'],
        }),
      ).toBe("WORKDAY_DIFF({date1}, {date2}, '10/30/21', '11/19/21')");
      expect(
        dateWorkDayDiffFunc.$workDayDiff({
          date1: { $fieldName: 'date1' },
          date2: { $fieldName: 'date2' },
        }),
      ).toBe('WORKDAY_DIFF({date1}, {date2})');
      expect(lastModifiedFunc.$lastModified(['date1', 'date2'])).toBe(
        'LAST_MODIFIED_TIME({date1}, {date2})',
      );
    });
  });

  describe('queryBuilder', () => {
    test('should return a filter formula string from a query object', () => {
      expect(
        queryBuilder({
          field: {
            $lt: 10,
            $lte: 9,
            $gt: 5,
            $gte: 4,
            $eq: 7,
            $neq: 8,
          },
          $not: {
            $or: [
              { $and: [{ field1: 'yes' }, { field2: true }] },
              { field3: false },
            ],
          },
          $if: {
            expression: {
              $isError: {
                $fieldName: 'field4',
              },
            },
            ifTrue: 'err',
            ifFalse: 'no err',
          },
          $switch: {
            expression: {
              $fieldName: 'field1',
            },
            cases: [
              {
                switchCase: 'yes',
                val: true,
              },
              {
                switchCase: 'no',
                val: false,
              },
              {
                switchCase: 'maybe',
                val: null,
              },
            ],
            defaultVal: ERROR,
          },
          $xor: [
            {
              field5: {
                $lt: 50,
              },
            },
            {
              field5: {
                $gt: 40,
              },
            },
            {
              field5: {
                $neq: 45,
              },
            },
          ],
        }),
      ).toBe('');
      // @ts-ignore
      expect(() => queryBuilder({ test: undefined })).toThrowError(
        'Invalid query',
      );
      // @ts-ignore
      expect(() => queryBuilder({ test: () => 10 })).toThrowError(
        'Invalid Query Object',
      );
    });
  });
});

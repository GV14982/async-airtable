import { baseHandler } from '../baseHandlers';
import buildOpts from '../buildOpts';
import checkArg from '../checkArg';
import checkError from '../checkError';
import {
  allIndexesValid,
  isBaseField,
  isIfArgs,
  isJoinArgs,
  isQueryObject,
  isQueryObjectArray,
  isRegexArgs,
  isRegexReplaceArgs,
  isStringOrFieldNameObject,
  isSwitchArgs,
  isTextArgArray,
  isTextDoubleArg,
  isTextMidArgs,
  isTextReplaceArgs,
  isTextSearchArgs,
  isTextSubArgs,
} from '../typeCheckers';

describe('Helper Functions', () => {
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
        "fields%5B%5D=name&fields%5B%5D=email&fields%5B%5D=date&filterByFormula=%7Bname%7D%20%3D%20'Paul'&maxRecords=50&pageSize=10&sort%5B0%5D%5Bfield%5D=name&sort%5B0%5D%5Bdirection%5D=desc&sort%5B1%5D%5Bfield%5D=date&sort%5B1%5D%5Bdirection%5D=asc&view=Grid%20view",
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
        "fields%5B%5D=name&fields%5B%5D=email&fields%5B%5D=date&filterByFormula=%7Bname%7D%20%3D%20'Paul'&maxRecords=50&pageSize=10&sort%5B0%5D%5Bfield%5D=name&sort%5B0%5D%5Bdirection%5D=desc&sort%5B1%5D%5Bfield%5D=date&sort%5B1%5D%5Bdirection%5D=asc&view=Grid%20view",
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

  describe('Base Handlers', () => {
    expect(baseHandler('test')).toBe("'test'");
    expect(baseHandler(9)).toBe('9');
    expect(baseHandler(null)).toBe('BLANK()');
    expect(baseHandler(true)).toBe('TRUE()');
    expect(baseHandler(false)).toBe('FALSE()');
  });

  describe('checkErrors', () => {
    test('should return a boolean denoting if the status is in the 200 range', () => {
      expect(checkError(200)).toBe(false);
      expect(checkError(300)).toBe(true);
    });
  });

  describe('Type Checkers', () => {
    test('should return true if the val is a given type', () => {
      expect(isQueryObject({ test: true })).toBe(true);
      expect(isQueryObjectArray([{ test: true }])).toBe(true);
      expect(isTextArgArray(['test'])).toBe(true);
      expect(isStringOrFieldNameObject('test')).toBe(true);
      expect(isStringOrFieldNameObject({ $fieldName: 'test' })).toBe(true);
      expect(isJoinArgs({ fieldName: 'test', separator: ':' })).toBe(true);
      expect(
        isTextSearchArgs({ stringToFind: 'test', whereToSearch: 'test' }),
      ).toBe(true);
      expect(
        isTextSearchArgs({
          stringToFind: 'test',
          whereToSearch: 'test',
          index: 2,
        }),
      ).toBe(true);
      expect(
        isTextSubArgs({ text: 'test', oldText: 'test', newText: 'text' }),
      ).toBe(true);
      expect(
        isTextSubArgs({
          text: 'test',
          oldText: 'test',
          newText: 'text',
          index: 2,
        }),
      ).toBe(true);
      expect(
        isTextReplaceArgs({
          text: 'test',
          startChar: 0,
          numChars: 1,
          replacement: 'r',
        }),
      ).toBe(true);
      expect(
        isTextMidArgs({
          text: 'test',
          whereToStart: 0,
          num: 1,
        }),
      ).toBe(true);
      expect(
        isTextDoubleArg({
          text: 'test',
          num: 1,
        }),
      ).toBe(true);
      expect(allIndexesValid([{ test: 'test' }])).toBe(true);
      expect(isBaseField('test')).toBe(true);
      expect(
        isIfArgs({
          expression: { field: { $lt: 10 } },
          ifTrue: true,
          ifFalse: false,
        }),
      ).toBe(true);
      expect(
        isSwitchArgs({
          expression: { $fieldName: 'test' },
          cases: [
            {
              switchCase: 'test',
              val: 'test',
            },
          ],
          defaultVal: false,
        }),
      ).toBe(true);
      expect(isRegexArgs({ text: 'test', regex: 'test' })).toBe(true);
      expect(
        isRegexReplaceArgs({
          text: 'test',
          regex: 'test',
          replacement: 'text',
        }),
      ).toBe(true);
    });
  });
});

import { AsyncAirtable } from '../asyncAirtable';
import { AirtableRecord } from '../types';
import { config } from 'dotenv';
config();
const asyncAirtable = new AsyncAirtable(
  process.env.AIRTABLE_KEY || '',
  process.env.AIRTABLE_BASE || '',
);
let firstPage: AirtableRecord[];

const checkResult = (
  result: AirtableRecord[],
  length?: number,
  fields?: boolean,
) => {
  expect(result).toBeDefined();
  expect(Array.isArray(result)).toBe(true);
  if (length) expect(result).toHaveLength(length);
  result.forEach((item) => {
    expect(typeof item).toBe('object');
    if (fields) expect(Object.keys(item.fields)).toHaveLength(1);
  });
};

describe('.select', () => {
  test('should respond with all entries without any options', async () => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '');
    checkResult(items);
  });

  test('should respond with the first page of results using the pageSize option and adding a page argument', async () => {
    const items = await asyncAirtable.select(
      process.env.AIRTABLE_TABLE || '',
      { pageSize: 20 },
      1,
    );
    checkResult(items, 20);
    firstPage = items;
  });

  test('should respond with the second page by incrementing the page argument', async () => {
    const items = await asyncAirtable.select(
      process.env.AIRTABLE_TABLE || '',
      { pageSize: 20 },
      2,
    );
    checkResult(items, 20);
    expect(JSON.stringify(items)).not.toEqual(JSON.stringify(firstPage));
  });

  test('should respond with a subset of records using the maxRecords option', async () => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      maxRecords: 30,
    });
    checkResult(items, 30);
  });

  test('should respond with a sorted array when using the sort option', async () => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      sort: [{ field: 'title' }],
    });
    checkResult(items);
  });

  test('should respond with only specific fields when using the fields option', async () => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      fields: ['title'],
    });
    checkResult(items, parseInt(process.env.NUM_RECORDS || ''), true);
  });

  test('should respond with only specific records when using the filterByFormula option', async () => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      filterByFormula: process.env.TEST_FILTER || '',
    });
    checkResult(items);
  });

  test('should respond with only specific records when using the where option', async () => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      where: {
        email: 'same@test.com',
      },
    });
    checkResult(items);
  });

  test('should respond with records in the format of the view specified.', async () => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      view: 'Kanban',
    });
    checkResult(items);
  });

  test('should throw an error if you do not pass a table', async () => {
    // @ts-ignore
    await expect(asyncAirtable.select()).rejects.toThrowError(
      'Argument "table" is required',
    );
  });

  test('should throw an error if the table does not exist', async () => {
    await expect(asyncAirtable.select('doesnotexist')).rejects.toThrowError(
      /"TABLE_NOT_FOUND"/g,
    );
  });

  test('should throw an error if you pass an incorrect data type for table', async () => {
    // @ts-ignore
    await expect(asyncAirtable.select(10)).rejects.toThrowError(
      /Incorrect data type/g,
    );
  });

  test('should throw an error if you pass an incorrect data type for options', async () => {
    await expect(
      // @ts-ignore
      asyncAirtable.select(process.env.AIRTABLE_TABLE || '', 10),
    ).rejects.toThrowError(/Incorrect data type/g);
  });

  test('should throw an error if you pass in an invalid option', async () => {
    await expect(
      asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
        // @ts-ignore
        test: 'test',
      }),
    ).rejects.toThrowError('Invalid option: test');
  });

  test('should throw an error if you pass an incorrect data type for page', async () => {
    await expect(
      // @ts-ignore
      asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {}, [10]),
    ).rejects.toThrowError(/Incorrect data type/g);
  });
  test('should throw an error if you pass a table name that does not exist with a page as well', async () => {
    await expect(
      asyncAirtable.select('doesnotexist' || '', {}, 1),
    ).rejects.toThrowError(/NOT_FOUND/g);
  });
});

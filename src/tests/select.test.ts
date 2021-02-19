import { AsyncAirtable } from '../asyncAirtable';
import { AirtableRecord } from '../@types';
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
  test('should respond with all entries without any options', async (done) => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '');
    checkResult(items);
    done();
  });

  test('should respond with the first page of results using the pageSize option and adding a page argument', async (done) => {
    const items = await asyncAirtable.select(
      process.env.AIRTABLE_TABLE || '',
      { pageSize: 20 },
      1,
    );
    checkResult(items, 20);
    firstPage = items;
    done();
  });

  test('should respond with the second page by incrementing the page argument', async (done) => {
    const items = await asyncAirtable.select(
      process.env.AIRTABLE_TABLE || '',
      { pageSize: 20 },
      2,
    );
    checkResult(items, 20);
    expect(JSON.stringify(items)).not.toEqual(JSON.stringify(firstPage));
    done();
  });

  test('should respond with a subset of records using the maxRecords option', async (done) => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      maxRecords: 30,
    });
    checkResult(items, 30);
    done();
  });

  test('should respond with a sorted array when using the sort option', async (done) => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      sort: [{ field: 'title' }],
    });
    checkResult(items);
    done();
  });

  test('should respond with only specific fields when using the fields option', async (done) => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      fields: ['title'],
    });
    checkResult(items, parseInt(process.env.NUM_RECORDS || ''), true);
    done();
  });

  test('should respond with only specific records when using the filterByFormula option', async (done) => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      filterByFormula: process.env.TEST_FILTER || '',
    });
    checkResult(items);
    done();
  });

  test('should respond with only specific records when using the where option', async (done) => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      where: {
        email: 'same@test.com',
      },
    });
    checkResult(items);
    done();
  });

  test('should respond with records in the format of the view specified.', async (done) => {
    const items = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      view: 'Kanban',
    });
    checkResult(items);
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    // @ts-ignore
    await expect(asyncAirtable.select()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if the table does not exist', async (done) => {
    await expect(asyncAirtable.select('doesnotexist')).rejects.toThrowError(
      /"TABLE_NOT_FOUND"/g,
    );
    done();
  });

  test('should throw an error if you pass an incorrect data type for table', async (done) => {
    // @ts-ignore
    await expect(asyncAirtable.select(10)).rejects.toThrowError(
      /Incorrect data type/g,
    );
    done();
  });

  test('should throw an error if you pass an incorrect data type for options', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.select(process.env.AIRTABLE_TABLE || '', 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if you pass in an invalid option', async (done) => {
    await expect(
      asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
        // @ts-ignore
        test: 'test',
      }),
    ).rejects.toThrowError('Invalid option: test');
    done();
  });

  test('should throw an error if you pass an incorrect data type for page', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {}, [10]),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });
  test('should throw an error if you pass a table name that does not exist with a page as well', async (done) => {
    await expect(
      asyncAirtable.select('doesnotexist' || '', {}, 1),
    ).rejects.toThrowError(/NOT_FOUND/g);
    done();
  });

  test('should retry if rate limited', async (done) => {
    let results = [];
    for (let i = 0; i < parseInt(process.env.REQ_COUNT || ''); i++) {
      results.push(
        i % 2 === 0
          ? asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
              maxRecords: 1,
            })
          : asyncAirtable.select(
              process.env.AIRTABLE_TABLE || '',
              { pageSize: 1 },
              1,
            ),
      );
    }
    const data: Array<AirtableRecord[]> = await Promise.all(results);
    data.forEach((result) => {
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      result.forEach((record) => {
        expect(record).toHaveProperty('id');
        expect(record).toHaveProperty('fields');
        expect(record).toHaveProperty('createdTime');
      });
    });
    done();
  });
});

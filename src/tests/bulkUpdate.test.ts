import { AsyncAirtable } from '../asyncAirtable';
import { AirtableRecord } from '../types';
import { config } from 'dotenv';
config();
const asyncAirtable = new AsyncAirtable(
  process.env.AIRTABLE_KEY || '',
  process.env.AIRTABLE_BASE || '',
);
let initResult: AirtableRecord[];
describe('.bulkUpdate', () => {
  beforeAll(async () => {
    initResult = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      sort: [{ field: 'value', direction: 'asc' }],
      view: 'Grid view',
    });
    initResult = initResult.slice(initResult.length - 7, initResult.length - 4);
  });

  test('should update a record with provided data', async () => {
    const results = await asyncAirtable.bulkUpdate(
      process.env.AIRTABLE_TABLE || '',
      [
        {
          id: initResult[0].id,
          fields: JSON.parse(process.env.BULK_UPDATE || ''),
        },
        {
          id: initResult[1].id,
          fields: JSON.parse(process.env.BULK_UPDATE || ''),
        },
        {
          id: initResult[2].id,
          fields: JSON.parse(process.env.BULK_UPDATE || ''),
        },
      ],
      {},
    );
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    results.forEach((result) => {
      expect(result.id).toBeDefined();
      expect(result.fields).toBeDefined();
      expect(Object.keys(result.fields).length).toBeGreaterThan(0);
      expect(result.createdTime).toBeDefined();
    });
    results.forEach((result, i) => {
      expect(JSON.stringify(result)).not.toEqual(JSON.stringify(initResult[i]));
    });
  });

  test('should update a record with provided data and the destructive flag', async () => {
    const results = await asyncAirtable.bulkUpdate(
      process.env.AIRTABLE_TABLE || '',
      [
        {
          id: initResult[0].id,
          fields: JSON.parse(process.env.DESTRUCTIVE_UPDATE_RECORD || ''),
        },
        {
          id: initResult[1].id,
          fields: JSON.parse(process.env.DESTRUCTIVE_UPDATE_RECORD || ''),
        },
        {
          id: initResult[2].id,
          fields: JSON.parse(process.env.DESTRUCTIVE_UPDATE_RECORD || ''),
        },
      ],
      {
        destructive: true,
      },
    );
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    results.forEach((result) => {
      expect(result.id).toBeDefined();
      expect(result.fields).toBeDefined();
      expect(Object.keys(result.fields).length).toBeGreaterThan(0);
      expect(result.createdTime).toBeDefined();
    });
    results.forEach((result, i) => {
      expect(result).not.toHaveProperty('email');
    });
  });

  test('should throw an error if you do not pass a table', async () => {
    // @ts-ignore
    await expect(asyncAirtable.bulkUpdate()).rejects.toThrowError(
      'Argument "table" is required',
    );
  });

  test('should throw an error if you do not pass a record', async () => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE || ''),
    ).rejects.toThrowError('Argument "records" is required');
  });

  test('should throw an error if pass a field that does not exist', async () => {
    await expect(
      asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE || '', [
        {
          id: initResult[0].id,
          fields: { gringle: 'grangle' },
        },
      ]),
    ).rejects.toThrowError(/UNKNOWN_FIELD_NAME/g);
  });

  test('should throw an error if you send an incorrect id', async () => {
    await expect(
      asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE || '', [
        { id: 'doesnotexist', ...JSON.parse(process.env.BULK_UPDATE || '') },
      ]),
    ).rejects.toThrowError(/INVALID_RECORDS/g);
  });

  test('should throw an error if pass a field with the incorrect data type', async () => {
    await expect(
      asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE || '', [
        {
          id: initResult[0].id,
          fields: {
            ...JSON.parse(process.env.BULK_UPDATE || ''),
            value: 'nope',
          },
        },
      ]),
    ).rejects.toThrowError(/INVALID_VALUE_FOR_COLUMN/g);
  });

  test('should throw an error if pass the table argument with an incorrect data type', async () => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkUpdate(10, [
        {
          id: initResult[0].id,
          fields: JSON.parse(process.env.BULK_UPDATE || ''),
        },
      ]),
    ).rejects.toThrowError(/Incorrect data type/g);
  });

  test('should throw an error if pass the record argument with an incorrect data type', async () => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE || '', 10),
    ).rejects.toThrowError(/Incorrect data type/g);
  });
});

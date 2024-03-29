import { AsyncAirtable } from '../asyncAirtable';
import { AirtableRecord } from '../types';
import { config } from 'dotenv';
config();
const asyncAirtable = new AsyncAirtable(
  process.env.AIRTABLE_KEY || '',
  process.env.AIRTABLE_BASE || '',
);
let created: AirtableRecord;
let deleteGroup: string[] = [];
describe('.bulkCreate', () => {
  test('should create a new entry in the table with the given fields', async () => {
    const results = await asyncAirtable.bulkCreate(
      process.env.AIRTABLE_TABLE || '',
      [
        JSON.parse(process.env.NEW_RECORD || ''),
        JSON.parse(process.env.NEW_RECORD || ''),
      ],
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
    created = results[0];
    results.map((result) => {
      deleteGroup.push(result.id);
    });
  });

  test('should be able to find the record by the id after creation', async () => {
    const result = await asyncAirtable.find(
      process.env.AIRTABLE_TABLE || '',
      created.id,
    );
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.fields).toBeDefined();
    expect(result.createdTime).toBeDefined();
    expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(created));
  });

  test('should throw an error if you do not pass a table', async () => {
    // @ts-ignore
    await expect(asyncAirtable.bulkCreate()).rejects.toThrowError(
      'Argument "table" is required',
    );
  });

  test('should throw an error if you do not pass a record', async () => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkCreate(process.env.AIRTABLE_TABLE),
    ).rejects.toThrowError('Argument "records" is required');
  });

  test('should throw an error if pass a field that does not exist', async () => {
    await expect(
      asyncAirtable.bulkCreate(process.env.AIRTABLE_TABLE || '', [
        {
          gringle: 'grangle',
        },
      ]),
    ).rejects.toThrowError(/UNKNOWN_FIELD_NAME/g);
  });

  test('should throw an error if pass a field with the incorrect data type', async () => {
    await expect(
      asyncAirtable.bulkCreate(process.env.AIRTABLE_TABLE || '', [
        { ...JSON.parse(process.env.NEW_RECORD || ''), value: 'nope' },
      ]),
    ).rejects.toThrowError(/INVALID_VALUE_FOR_COLUMN/g);
  });

  test('should throw an error if pass the table argument with an incorrect data type', async () => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkCreate(10, JSON.parse(process.env.NEW_RECORD)),
    ).rejects.toThrowError(/Incorrect data type/g);
  });

  test('should throw an error if pass the record argument with an incorrect data type', async () => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkCreate(process.env.AIRTABLE_TABLE, 10),
    ).rejects.toThrowError(/Incorrect data type/g);
  });
});

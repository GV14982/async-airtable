import { AsyncAirtable } from '../asyncAirtable';
import { AirtableRecord } from '../types';
import { config } from 'dotenv';
config();
const asyncAirtable = new AsyncAirtable(
  process.env.AIRTABLE_KEY || '',
  process.env.AIRTABLE_BASE || '',
);
let initResult: AirtableRecord[];
describe('.updateRecord', () => {
  beforeAll(async (done) => {
    initResult = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      maxRecords: 2,
      sort: [{ field: 'value', direction: 'desc' }],
      view: 'Grid view',
    });
    done();
  });

  test('should update a record with provided data', async (done) => {
    const result = await asyncAirtable.updateRecord(
      process.env.AIRTABLE_TABLE || '',
      {
        id: initResult[0].id,
        fields: JSON.parse(process.env.UPDATE_RECORD || ''),
      },
    );
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.fields).toBeDefined();
    expect(result.createdTime).toBeDefined();
    expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    expect(JSON.stringify(result)).not.toEqual(JSON.stringify(initResult[0]));
    initResult[0] = result;
    done();
  });

  test('should update a record and set unprovided field to null if you pass in the destructive arg', async (done) => {
    const result = await asyncAirtable.updateRecord(
      process.env.AIRTABLE_TABLE || '',
      {
        id: initResult[0].id,
        fields: JSON.parse(process.env.DESTRUCTIVE_UPDATE_RECORD || ''),
      },
      { destructive: true },
    );
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.fields).toBeDefined();
    expect(result.createdTime).toBeDefined();
    expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    expect(JSON.stringify(result)).not.toEqual(JSON.stringify(initResult[0]));
    expect(result).not.toHaveProperty('email');
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    // @ts-ignore
    await expect(asyncAirtable.updateRecord()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass a record', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.updateRecord(process.env.AIRTABLE_TABLE || ''),
    ).rejects.toThrowError('Argument "record" is required');
    done();
  });

  test('should throw an error if you pass a field that does not exist', async (done) => {
    await expect(
      asyncAirtable.updateRecord(process.env.AIRTABLE_TABLE || '', {
        id: initResult[0].id,
        //@ts-ignore
        fields: { gringle: 'grangle' },
      }),
    ).rejects.toThrowError(/UNKNOWN_FIELD_NAME/g);
    done();
  });

  test('should throw an error if you send an incorrect id', async (done) => {
    await expect(
      asyncAirtable.updateRecord(process.env.AIRTABLE_TABLE || '', {
        id: 'doesnotexist',
        fields: JSON.parse(process.env.UPDATE_RECORD || ''),
      }),
    ).rejects.toThrowError(/NOT_FOUND/g);
    done();
  });

  test('should throw an error if pass a field with the incorrect data type', async (done) => {
    await expect(
      asyncAirtable.updateRecord(process.env.AIRTABLE_TABLE || '', {
        id: initResult[0].id,
        fields: {
          ...JSON.parse(process.env.UPDATE_RECORD || ''),
          value: 'nope',
        },
      }),
    ).rejects.toThrowError(/INVALID_VALUE_FOR_COLUMN/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.updateRecord(10, {
        id: initResult[0].id,
        fields: JSON.parse(process.env.UPDATE_RECORD || ''),
      }),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the record argument with an incorrect data type', async (done) => {
    await expect(
      //@ts-ignore
      asyncAirtable.updateRecord(process.env.AIRTABLE_TABLE || '', 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });
});

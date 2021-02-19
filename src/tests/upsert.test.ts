import { AsyncAirtable } from '../asyncAirtable';
import { AirtableRecord } from '../@types';
import { config } from 'dotenv';
config();
const asyncAirtable = new AsyncAirtable(
  process.env.AIRTABLE_KEY || '',
  process.env.AIRTABLE_BASE || '',
);
let initResult: AirtableRecord[];
describe('.upsertRecord', () => {
  beforeAll(async (done) => {
    initResult = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      filterByFormula: "{title} = 'test-find'",
      maxRecords: 1,
      sort: [{ field: 'value', direction: 'asc' }],
      view: 'Grid view',
    });
    done();
  });

  test('should update a record with provided data if it exists', async (done) => {
    const result = await asyncAirtable.upsertRecord(
      process.env.AIRTABLE_TABLE || '',
      "{title} = 'test-upsert'",
      JSON.parse(process.env.UPDATE_RECORD || ''),
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

  test('should update a record with provided data desctructively if it exists', async (done) => {
    const result = await asyncAirtable.upsertRecord(
      process.env.AIRTABLE_TABLE || '',
      "{title} = 'test-upsert'",
      JSON.parse(process.env.DESTRUCTIVE_UPDATE_RECORD || ''),
      { destructive: true },
    );
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.fields).toBeDefined();
    expect(result.createdTime).toBeDefined();
    expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    expect(result.fields).not.toHaveProperty('email');
    done();
  });

  test('should create a new record with provided data if one does not exist', async (done) => {
    const result = await asyncAirtable.upsertRecord(
      process.env.AIRTABLE_TABLE || '',
      "{title} = 'test-test'",
      JSON.parse(process.env.UPDATE_RECORD || ''),
    );
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.fields).toBeDefined();
    expect(result.createdTime).toBeDefined();
    expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    expect(result.id).not.toEqual(initResult[0].id);
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    // @ts-ignore
    await expect(asyncAirtable.upsertRecord()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass a filterString', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.upsertRecord(process.env.AIRTABLE_TABLE || ''),
    ).rejects.toThrowError('Argument "filterString" is required');
    done();
  });

  test('should throw an error if you do not pass a record', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.upsertRecord(
        process.env.AIRTABLE_TABLE || '',
        "{title} = 'test-create'",
      ),
    ).rejects.toThrowError('Argument "record" is required');
    done();
  });

  test('should throw an error if you pass a field that does not exist', async (done) => {
    await expect(
      asyncAirtable.upsertRecord(
        process.env.AIRTABLE_TABLE || '',
        "{title} = 'test-create'",
        {
          gringle: 'grangle',
        },
      ),
    ).rejects.toThrowError(/UNKNOWN_FIELD_NAME/g);
    done();
  });

  test('should throw an error if pass a field with the incorrect data type', async (done) => {
    await expect(
      asyncAirtable.upsertRecord(
        process.env.AIRTABLE_TABLE || '',
        "{title} = 'test-create'",
        {
          ...JSON.parse(process.env.UPDATE_RECORD || ''),
          value: 'nope',
        },
      ),
    ).rejects.toThrowError(/INVALID_VALUE_FOR_COLUMN/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      asyncAirtable.upsertRecord(
        // @ts-ignore
        10,
        "{title} = 'test-create'",
        JSON.parse(process.env.UPDATE_RECORD || ''),
      ),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the filterString argument with an incorrect data type', async (done) => {
    await expect(
      asyncAirtable.upsertRecord(
        process.env.AIRTABLE_TABLE || '',
        //@ts-ignore
        10,
        JSON.parse(process.env.UPDATE_RECORD || ''),
      ),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the record argument with an incorrect data type', async (done) => {
    await expect(
      asyncAirtable.upsertRecord(
        process.env.AIRTABLE_TABLE || '',
        "{title} = 'test-create'",
        //@ts-ignore
        10,
      ),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should if rate limited', async (done) => {
    let results = [];
    for (let i = 0; i < parseInt(process.env.REQ_COUNT || ''); i++) {
      results.push(
        asyncAirtable.upsertRecord(
          process.env.AIRTABLE_TABLE || '',
          "{title} = 'test-upsert-2'",
          JSON.parse(process.env.UPDATE_RECORD || ''),
        ),
      );
    }
    const data: AirtableRecord[] = await Promise.all(results);
    data.forEach((result) => {
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBeGreaterThan(0);
      expect(result.id).toBeDefined();
      expect(result.fields).toBeDefined();
      expect(result.createdTime).toBeDefined();
      expect(Object.keys(result.fields).length).toBeGreaterThan(0);
      expect(JSON.stringify(result)).not.toEqual(JSON.stringify(initResult[0]));
    });
    done();
  });
});

import { AsyncAirtable } from '../asyncAirtable';
import { AirtableRecord } from '../types';
import { config } from 'dotenv';
config();
const asyncAirtable = new AsyncAirtable(
  process.env.AIRTABLE_KEY || '',
  process.env.AIRTABLE_BASE || '',
);
let deleteGroup: string[];
let deleteTest: AirtableRecord[] = [];
describe('.bulkDelete', () => {
  beforeAll(async (done) => {
    const results = await asyncAirtable.select(
      process.env.AIRTABLE_TABLE || '',
      { view: 'Grid view' },
    );

    deleteGroup = results
      .slice(results.length - 4, results.length)
      .map((result) => result.id);

    const records = [];
    for (let i = 0; i < 10; i++) {
      records.push(JSON.parse(process.env.NEW_RECORD || ''));
    }
    for (let j = 0; j < parseInt(process.env.REQ_COUNT || '') / 10; j++) {
      const values = await asyncAirtable.bulkCreate(
        process.env.AIRTABLE_TABLE || '',
        records,
      );
      deleteTest = [...deleteTest, ...values];
    }
    done();
  });

  test('should delete a record with the given id', async (done) => {
    const deleted = await asyncAirtable.bulkDelete(
      process.env.AIRTABLE_TABLE || '',
      deleteGroup,
    );
    expect(deleted).toBeDefined();
    expect(Array.isArray(deleted)).toBe(true);
    expect(deleted.length).toBeGreaterThan(0);
    deleted.forEach((del) => {
      expect(Object.keys(del).length).toBeGreaterThan(0);
      expect(del.deleted).toBeDefined();
      expect(del.deleted).toBe(true);
      expect(del.id).toBeDefined();
      expect(deleteGroup).toContain(del.id);
    });
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    // @ts-ignore
    await expect(asyncAirtable.bulkDelete()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass an id', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkDelete(process.env.AIRTABLE_TABLE || ''),
    ).rejects.toThrowError('Argument "ids" is required');
    done();
  });

  test('should throw an error if the id does not exist', async (done) => {
    await expect(
      asyncAirtable.bulkDelete(process.env.AIRTABLE_TABLE || '', [
        'doesnotexist',
      ]),
    ).rejects.toThrowError(/"INVALID_RECORDS"/g);
    done();
  });

  test('should throw an error if the id has already been deleted', async (done) => {
    await expect(
      asyncAirtable.bulkDelete(process.env.AIRTABLE_TABLE || '', deleteGroup),
    ).rejects.toThrowError(/"NOT_FOUND"/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkDelete(10, deleteGroup),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the id argument with an incorrect data type', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkDelete(process.env.AIRTABLE_TABLE || '', 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });
});

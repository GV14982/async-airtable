import { AsyncAirtable } from '../asyncAirtable';
import { AirtableRecord } from '../types';
import { config } from 'dotenv';
config();
const asyncAirtable = new AsyncAirtable(
  process.env.AIRTABLE_KEY || '',
  process.env.AIRTABLE_BASE || '',
);
let deleteMe: string;
let deleteTest: AirtableRecord[] = [];
describe('.deleteRecord', () => {
  beforeAll(async () => {
    const result = await asyncAirtable.select(
      process.env.AIRTABLE_TABLE || '',
      { maxRecords: 2, view: 'Grid view' },
    );
    deleteMe = result[1].id;
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
  });

  test('should delete a record with the given id', async () => {
    const deleted = await asyncAirtable.deleteRecord(
      process.env.AIRTABLE_TABLE || '',
      deleteMe,
    );
    expect(deleted).toBeDefined();
    expect(typeof deleted).toBe('object');
    expect(Object.keys(deleted).length).toBeGreaterThan(0);
    expect(deleted.deleted).toBeDefined();
    expect(deleted.deleted).toBe(true);
    expect(deleted.id).toBeDefined();
    expect(deleted.id).toBe(deleteMe);
  });

  test('should throw an error if you do not pass a table', async () => {
    // @ts-ignore
    await expect(asyncAirtable.deleteRecord()).rejects.toThrowError(
      'Argument "table" is required',
    );
  });

  test('should throw an error if you do not pass an id', async () => {
    await expect(
      // @ts-ignore
      asyncAirtable.deleteRecord(process.env.AIRTABLE_TABLE || ''),
    ).rejects.toThrowError('Argument "id" is required');
  });

  test('should throw an error if the id does not exist', async () => {
    await expect(
      //@ts-ignore
      asyncAirtable.deleteRecord(
        process.env.AIRTABLE_TABLE || '',
        'doesnotexist',
      ),
    ).rejects.toThrowError(/"NOT_FOUND"/g);
  });

  test('should throw an error if the id has already been deleted', async () => {
    await expect(
      //@ts-ignore
      asyncAirtable.deleteRecord(process.env.AIRTABLE_TABLE || '', deleteMe),
    ).rejects.toThrowError(/"Record not found"/g);
  });

  test('should throw an error if pass the table argument with an incorrect data type', async () => {
    await expect(
      // @ts-ignore
      asyncAirtable.deleteRecord(10, deleteMe),
    ).rejects.toThrowError(/Incorrect data type/g);
  });

  test('should throw an error if pass the id argument with an incorrect data type', async () => {
    await expect(
      // @ts-ignore
      asyncAirtable.deleteRecord(process.env.AIRTABLE_TABLE || '', 10),
    ).rejects.toThrowError(/Incorrect data type/g);
  });
});

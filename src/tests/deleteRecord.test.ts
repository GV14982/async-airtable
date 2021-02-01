import { AsyncAirtable } from '../asyncAirtable';
import { AirtableRecord, DeleteResponse } from '../@types';
import { config } from 'dotenv';
config();
const asyncAirtable = new AsyncAirtable(
  process.env.AIRTABLE_KEY || '',
  process.env.AIRTABLE_BASE || '',
);
let deleteMe: string;
let deleteTest: AirtableRecord[] = [];
describe('.deleteRecord', () => {
  beforeAll(async (done) => {
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
    done();
  });

  test('should delete a record with the given id', async (done) => {
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
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    // @ts-ignore
    await expect(asyncAirtable.deleteRecord()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass an id', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.deleteRecord(process.env.AIRTABLE_TABLE || ''),
    ).rejects.toThrowError('Argument "id" is required');
    done();
  });

  test('should throw an error if the id does not exist', async (done) => {
    await expect(
      //@ts-ignore
      asyncAirtable.deleteRecord(
        process.env.AIRTABLE_TABLE || '',
        'doesnotexist',
      ),
    ).rejects.toThrowError(/"NOT_FOUND"/g);
    done();
  });

  test('should throw an error if the id has already been deleted', async (done) => {
    await expect(
      //@ts-ignore
      asyncAirtable.deleteRecord(process.env.AIRTABLE_TABLE || '', deleteMe),
    ).rejects.toThrowError(/"Record not found"/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.deleteRecord(10, deleteMe),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the id argument with an incorrect data type', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.deleteRecord(process.env.AIRTABLE_TABLE || '', 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should retry if rate limited', async (done) => {
    let results = [];
    for (let i = 0; i < parseInt(process.env.REQ_COUNT || ''); i++) {
      results.push(
        asyncAirtable.deleteRecord(
          process.env.AIRTABLE_TABLE || '',
          deleteTest[i].id,
        ),
      );
    }
    const data: DeleteResponse[] = await Promise.all(results);
    data.forEach((deleted, i) => {
      expect(deleted).toBeDefined();
      expect(typeof deleted).toBe('object');
      expect(Object.keys(deleted).length).toBeGreaterThan(0);
      expect(deleted.deleted).toBeDefined();
      expect(deleted.deleted).toBe(true);
      expect(deleted.id).toBeDefined();
      expect(deleted.id).toBe(deleteTest[i].id);
    });
    done();
  });
});

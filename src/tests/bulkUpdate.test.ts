import AsyncAirtable, { AirtableRecord } from '../asyncAirtable';
import { config } from 'dotenv';
config();
const asyncAirtable = new AsyncAirtable(
  process.env.AIRTABLE_KEY || '',
  process.env.AIRTABLE_BASE || '',
);
let initResult: AirtableRecord[];
describe('.bulkUpdate', () => {
  beforeAll(async (done) => {
    initResult = await asyncAirtable.select(process.env.AIRTABLE_TABLE || '', {
      sort: [{ field: 'value', direction: 'asc' }],
      view: 'Grid view',
    });
    initResult = initResult.slice(initResult.length - 7, initResult.length - 4);
    done();
  });

  test('should update a record with provided data', async (done) => {
    const results = await asyncAirtable.bulkUpdate(
      process.env.AIRTABLE_TABLE || '',
      [
        {
          id: initResult[0].id,
          fields: JSON.parse(process.env.UPDATE_RECORD || ''),
        },
        {
          id: initResult[1].id,
          fields: JSON.parse(process.env.UPDATE_RECORD || ''),
        },
        {
          id: initResult[2].id,
          fields: JSON.parse(process.env.UPDATE_RECORD || ''),
        },
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
    results.forEach((result, i) => {
      expect(JSON.stringify(result)).not.toEqual(JSON.stringify(initResult[i]));
    });
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    // @ts-ignore
    await expect(asyncAirtable.bulkUpdate()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass a record', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE || ''),
    ).rejects.toThrowError('Argument "records" is required');
    done();
  });

  test('should throw an error if pass a field that does not exist', async (done) => {
    await expect(
      asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE || '', [
        {
          id: initResult[0].id,
          fields: { gringle: 'grangle' },
        },
      ]),
    ).rejects.toThrowError(/UNKNOWN_FIELD_NAME/g);
    done();
  });

  test('should throw an error if you send an incorrect id', async (done) => {
    await expect(
      asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE || '', [
        { id: 'doesnotexist', ...JSON.parse(process.env.UPDATE_RECORD || '') },
      ]),
    ).rejects.toThrowError(/INVALID_RECORDS/g);
    done();
  });

  test('should throw an error if pass a field with the incorrect data type', async (done) => {
    await expect(
      asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE || '', [
        {
          id: initResult[0].id,
          fields: {
            ...JSON.parse(process.env.UPDATE_RECORD || ''),
            value: 'nope',
          },
        },
      ]),
    ).rejects.toThrowError(/INVALID_VALUE_FOR_COLUMN/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkUpdate(10, [
        {
          id: initResult[0].id,
          fields: JSON.parse(process.env.UPDATE_RECORD || ''),
        },
      ]),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the record argument with an incorrect data type', async (done) => {
    await expect(
      // @ts-ignore
      asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE || '', 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  // test('should retry if rate limited', async (done) => {
  //   let results = [];
  //   for (let i = 0; i < parseInt(process.env.REQ_COUNT || ''); i++) {
  //     results.push(
  //       asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE || '', [
  //         {
  //           id: initResult[0].id,
  //           fields: JSON.parse(process.env.UPDATE_RECORD || ''),
  //         },
  //         {
  //           id: initResult[1].id,
  //           fields: JSON.parse(process.env.UPDATE_RECORD || ''),
  //         },
  //         {
  //           id: initResult[2].id,
  //           fields: JSON.parse(process.env.UPDATE_RECORD || ''),
  //         },
  //       ]),
  //     );
  //   }
  //   const data: Array<AirtableRecord[]> = await Promise.all(results);
  //   data.forEach((results) => {
  //     expect(results).toBeDefined();
  //     expect(Array.isArray(results)).toBe(true);
  //     expect(results.length).toBeGreaterThan(0);
  //     results.forEach((result) => {
  //       expect(result.id).toBeDefined();
  //       expect(result.fields).toBeDefined();
  //       expect(Object.keys(result.fields).length).toBeGreaterThan(0);
  //       expect(result.createdTime).toBeDefined();
  //     });
  //   });
  //   done();
  // });
});

import { config } from 'dotenv';
import { AirtableRecord } from '../@types';
config();
import { AsyncAirtable } from '../asyncAirtable';
const requiredMethods = [
  'select',
  'find',
  'createRecord',
  'updateRecord',
  'deleteRecord',
  'bulkCreate',
  'bulkUpdate',
  'bulkDelete',
  'upsertRecord',
];

describe('asyncAirtable', () => {
  test('should instantiate a new AsyncAirtable instance with all required methods', () => {
    const asyncAirtable = new AsyncAirtable(
      process.env.AIRTABLE_KEY || '',
      process.env.AIRTABLE_BASE || '',
      { retryOnRateLimit: true },
    );

    const methods = Object.keys(asyncAirtable);
    requiredMethods.forEach((method) => {
      expect(methods.includes(method)).toBe(true);
    });
  });

  test('should throw an error if you instatiate without an API key', () => {
    expect(() => {
      // @ts-ignore
      new AsyncAirtable();
    }).toThrowError('API Key is required.');
  });

  test('should throw an error if you instatiate without a base ID', () => {
    expect(() => {
      // @ts-ignore
      new AsyncAirtable(process.env.AIRTABLE_KEY || '');
    }).toThrowError('Base ID is required.');
  });

  test('should retry if rate limited', async (done) => {
    const asyncAirtable = new AsyncAirtable(
      process.env.AIRTABLE_KEY || '',
      process.env.AIRTABLE_BASE || '',
      { retryOnRateLimit: true },
    );
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

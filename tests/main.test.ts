import {config} from 'dotenv';
config();
import AsyncAirtable from '../src/asyncAirtable';
const requiredMethods = [
  'select',
  'find',
  'createRecord',
  'updateRecord',
  'deleteRecord',
  'bulkCreate',
  'bulkUpdate',
  'bulkDelete',
];

describe('asyncAirtable', () => {
  test('should instantiate a new AsyncAirtable instance with all required methods', () => {
    const asyncAirtable = new AsyncAirtable(
      process.env.AIRTABLE_KEY,
      process.env.AIRTABLE_BASE,
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
      new AsyncAirtable(process.env.AIRTABLE_KEY);
    }).toThrowError('Base ID is required.');
  });

});

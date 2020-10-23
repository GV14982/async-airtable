require('dotenv').config();
const AsyncAirtable = require('../lib/asyncAirtable');

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
  test('should have all required methods', () => {
    const methods = Object.keys(global.asyncAirtable);
    requiredMethods.forEach((method) => {
      expect(methods.includes(method)).toBe(true);
    });
  });

  test('should throw an error if you instatiate without an API key', () => {
    expect(() => {
      new global.AsyncAirtable();
    }).toThrowError('API Key is required.');
  });

  test('should throw an error if you instatiate without a base ID', () => {
    expect(() => {
      new global.AsyncAirtable(process.env.AIRTABLE_KEY);
    }).toThrowError('Base ID is required.');
  });

  test('should instantiate a new AsyncAirtable instance with the opts object as well', () => {
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
});

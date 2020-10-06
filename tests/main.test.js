const requiredMethods = [
  'select',
  'find',
  'create',
  'update',
  'delete',
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
});

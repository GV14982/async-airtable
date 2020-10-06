let lastIds;
describe('.bulkDelete', () => {
  beforeAll(async (done) => {
    const result = await global.asyncAirtable.select(
      process.env.AIRTABLE_TABLE,
      { maxRecords: 5, sort: [{ field: 'id', direction: 'desc' }] },
    );
    lastIds = [result[3].id, result[4].id];
    done();
  });

  test('should delete a record with the given id', async (done) => {
    const deleted = await global.asyncAirtable.bulkDelete(
      process.env.AIRTABLE_TABLE,
      lastIds,
    );
    expect(deleted).toBeDefined();
    expect(Array.isArray(deleted)).toBe(true);
    expect(deleted.length).toBeGreaterThan(0);
    deleted.forEach((del, i) => {
      expect(Object.keys(del).length).toBeGreaterThan(0);
      expect(del.deleted).toBeDefined();
      expect(del.deleted).toBe(true);
      expect(del.id).toBeDefined();
      expect(del.id).toBe(lastIds[i]);
    });
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    await expect(global.asyncAirtable.bulkDelete()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass an id', async (done) => {
    await expect(
      global.asyncAirtable.bulkDelete(process.env.AIRTABLE_TABLE),
    ).rejects.toThrowError('Argument "ids" is required');
    done();
  });

  test('should throw an error if the id does not exist', async (done) => {
    await expect(
      global.asyncAirtable.bulkDelete(process.env.AIRTABLE_TABLE, [
        'doesnotexist',
      ]),
    ).rejects.toThrowError(/"INVALID_RECORDS"/g);
    done();
  });

  test('should throw an error if the id has already been deleted', async (done) => {
    await expect(
      global.asyncAirtable.bulkDelete(process.env.AIRTABLE_TABLE, lastIds),
    ).rejects.toThrowError(/"NOT_FOUND"/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.bulkDelete(10, lastIds),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the id argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.bulkDelete(process.env.AIRTABLE_TABLE, 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });
});

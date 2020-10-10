let deleteGroup;
describe('.bulkDelete', () => {
  beforeAll(async (done) => {
    const results = await global.asyncAirtable.select(
      process.env.AIRTABLE_TABLE,
      { view: 'Grid view' },
    );

    deleteGroup = results
      .slice(results.length - 4, results.length)
      .map((result) => result.id);
    done();
  });

  test('should delete a record with the given id', async (done) => {
    const deleted = await global.asyncAirtable.bulkDelete(
      process.env.AIRTABLE_TABLE,
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
      global.asyncAirtable.bulkDelete(process.env.AIRTABLE_TABLE, deleteGroup),
    ).rejects.toThrowError(/"NOT_FOUND"/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.bulkDelete(10, deleteGroup),
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

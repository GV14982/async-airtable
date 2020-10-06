let lastId;
describe('.delete', () => {
  beforeAll(async (done) => {
    const result = await global.asyncAirtable.select(
      process.env.AIRTABLE_TABLE,
      { maxRecords: 2, sort: [{ field: 'id', direction: 'desc' }] },
    );
    lastId = result[1].id;
    done();
  });

  test('should delete a record with the given id', async (done) => {
    const deleted = await global.asyncAirtable.delete(
      process.env.AIRTABLE_TABLE,
      lastId,
    );
    expect(deleted).toBeDefined();
    expect(typeof deleted).toBe('object');
    expect(Object.keys(deleted).length).toBeGreaterThan(0);
    expect(deleted.deleted).toBeDefined();
    expect(deleted.deleted).toBe(true);
    expect(deleted.id).toBeDefined();
    expect(deleted.id).toBe(lastId);
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    await expect(global.asyncAirtable.delete()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass an id', async (done) => {
    await expect(
      global.asyncAirtable.delete(process.env.AIRTABLE_TABLE),
    ).rejects.toThrowError('Argument "id" is required');
    done();
  });

  test('should throw an error if the id does not exist', async (done) => {
    await expect(
      global.asyncAirtable.delete(process.env.AIRTABLE_TABLE, 'doesnotexist'),
    ).rejects.toThrowError(/"NOT_FOUND"/g);
    done();
  });

  test('should throw an error if the id has already been deleted', async (done) => {
    await expect(
      global.asyncAirtable.delete(process.env.AIRTABLE_TABLE, lastId),
    ).rejects.toThrowError(/"Record not found"/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(global.asyncAirtable.delete(10, lastId)).rejects.toThrowError(
      /Incorrect data type/g,
    );
    done();
  });

  test('should throw an error if pass the id argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.delete(process.env.AIRTABLE_TABLE, 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });
});

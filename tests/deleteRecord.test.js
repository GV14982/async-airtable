let deleteMe;
describe('.deleteRecord', () => {
  beforeAll(async (done) => {
    const result = await global.asyncAirtable.select(
      process.env.AIRTABLE_TABLE,
      { maxRecords: 2, view: 'Grid view' },
    );
    deleteMe = result[1].id;
    done();
  });

  test('should delete a record with the given id', async (done) => {
    const deleted = await global.asyncAirtable.deleteRecord(
      process.env.AIRTABLE_TABLE,
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
    await expect(global.asyncAirtable.deleteRecord()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass an id', async (done) => {
    await expect(
      global.asyncAirtable.deleteRecord(process.env.AIRTABLE_TABLE),
    ).rejects.toThrowError('Argument "id" is required');
    done();
  });

  test('should throw an error if the id does not exist', async (done) => {
    await expect(
      global.asyncAirtable.deleteRecord(
        process.env.AIRTABLE_TABLE,
        'doesnotexist',
      ),
    ).rejects.toThrowError(/"NOT_FOUND"/g);
    done();
  });

  test('should throw an error if the id has already been deleted', async (done) => {
    await expect(
      global.asyncAirtable.deleteRecord(process.env.AIRTABLE_TABLE, deleteMe),
    ).rejects.toThrowError(/"Record not found"/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.deleteRecord(10, deleteMe),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the id argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.deleteRecord(process.env.AIRTABLE_TABLE, 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });
});

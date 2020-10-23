let deleteMe;
let deleteTest = [];
describe('.deleteRecord', () => {
  beforeAll(async (done) => {
    const result = await global.asyncAirtable.select(
      process.env.AIRTABLE_TABLE,
      { maxRecords: 2, view: 'Grid view' },
    );
    deleteMe = result[1].id;
    const records = [];
    for (let i = 0; i < 10; i++) {
      records.push(JSON.parse(process.env.NEW_RECORD));
    }
    for (let j = 0; j < 15; j++) {
      const values = await global.asyncAirtable.bulkCreate(
        process.env.AIRTABLE_TABLE,
        records,
      );
      deleteTest = [...deleteTest, ...values];
    }
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

  test('should retry after 30 seconds if rate limited', async (done) => {
    let results = [];
    for (let i = 0; i < 150; i++) {
      results.push(
        global.asyncAirtable.deleteRecord(
          process.env.AIRTABLE_TABLE,
          deleteTest[i].id,
        ),
      );
    }
    const data = await Promise.all(results);
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

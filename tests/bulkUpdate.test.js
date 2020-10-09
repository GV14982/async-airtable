let initResult;
describe('.bulkUpdate', () => {
  beforeAll(async (done) => {
    initResult = await global.asyncAirtable.find(
      process.env.AIRTABLE_TABLE,
      process.env.UPDATE_RECORD_ID,
    );
    done();
  });

  afterAll(async (done) => {
    await global.asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE, [
      JSON.parse(process.env.UPDATE_RECORD_RESET),
    ]);
    done();
  });

  test('should update a record with provided data', async (done) => {
    const results = await global.asyncAirtable.bulkUpdate(
      process.env.AIRTABLE_TABLE,
      [JSON.parse(process.env.UPDATE_RECORD)],
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
    expect(JSON.stringify(results[0])).not.toEqual(JSON.stringify(initResult));
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    await expect(global.asyncAirtable.bulkUpdate()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass a record', async (done) => {
    await expect(
      global.asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE),
    ).rejects.toThrowError('Argument "records" is required');
    done();
  });

  test('should throw an error if pass a field that does not exist', async (done) => {
    await expect(
      global.asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE, [
        {
          id: process.env.UPDATE_RECORD_ID,
          gringle: 'grangle',
        },
      ]),
    ).rejects.toThrowError(/UNKNOWN_FIELD_NAME/g);
    done();
  });

  test('should throw an error if you send an incorrect id', async (done) => {
    await expect(
      global.asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE, [
        JSON.parse(process.env.BAD_ID_UPDATE_RECORD),
      ]),
    ).rejects.toThrowError(/ROW_DOES_NOT_EXIST/g);
    done();
  });

  test('should throw an error if pass a field with the incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE, [
        JSON.parse(process.env.BAD_FIELD_UPDATE_RECORD),
      ]),
    ).rejects.toThrowError(/INVALID_VALUE_FOR_COLUMN/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.bulkUpdate(10, [
        JSON.parse(process.env.BAD_NEW_RECORD),
      ]),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the record argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.bulkUpdate(process.env.AIRTABLE_TABLE, 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });
});

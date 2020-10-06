describe('.update', () => {
  afterAll(async (done) => {
    await global.asyncAirtable.update(
      process.env.AIRTABLE_TABLE,
      JSON.parse(process.env.UPDATE_RECORD_RESET),
    );
    done();
  });

  test('should update a record with provided data', async (done) => {
    const result = await global.asyncAirtable.update(
      process.env.AIRTABLE_TABLE,
      JSON.parse(process.env.UPDATE_RECORD),
    );
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.fields).toBeDefined();
    expect(result.createdTime).toBeDefined();
    expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    await expect(global.asyncAirtable.update()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass a record', async (done) => {
    await expect(
      global.asyncAirtable.update(process.env.AIRTABLE_TABLE),
    ).rejects.toThrowError('Argument "record" is required');
    done();
  });

  test('should throw an error if pass a field that does not exist', async (done) => {
    await expect(
      global.asyncAirtable.update(process.env.AIRTABLE_TABLE, {
        id: process.env.UPDATE_RECORD_ID,
        gringle: 'grangle',
      }),
    ).rejects.toThrowError(/UNKNOWN_FIELD_NAME/g);
    done();
  });

  test('should throw an error if you send an incorrect id', async (done) => {
    await expect(
      global.asyncAirtable.update(
        process.env.AIRTABLE_TABLE,
        JSON.parse(process.env.BAD_ID_UPDATE_RECORD),
      ),
    ).rejects.toThrowError(/NOT_FOUND/g);
    done();
  });

  test('should throw an error if pass a field with the incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.update(
        process.env.AIRTABLE_TABLE,
        JSON.parse(process.env.BAD_FIELD_UPDATE_RECORD),
      ),
    ).rejects.toThrowError(/INVALID_VALUE_FOR_COLUMN/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.update(10, JSON.parse(process.env.BAD_NEW_RECORD)),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the record argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.update(process.env.AIRTABLE_TABLE, 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });
});

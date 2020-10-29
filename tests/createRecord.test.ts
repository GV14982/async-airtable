let created;
describe('.createRecord', () => {
  test('should create a new entry in the table with the given fields', async (done) => {
    const result = await global.asyncAirtable.createRecord(
      process.env.AIRTABLE_TABLE,
      JSON.parse(process.env.NEW_RECORD),
    );
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.fields).toBeDefined();
    expect(result.createdTime).toBeDefined();
    expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    created = result;
    done();
  });

  test('should be able to find the record by the id after creation', async (done) => {
    const result = await global.asyncAirtable.find(
      process.env.AIRTABLE_TABLE,
      created.id,
    );
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.fields).toBeDefined();
    expect(result.createdTime).toBeDefined();
    expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(created));
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    // @ts-ignore
    await expect(global.asyncAirtable.createRecord()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass a record', async (done) => {
    await expect(
      // @ts-ignore
      global.asyncAirtable.createRecord(process.env.AIRTABLE_TABLE),
    ).rejects.toThrowError('Argument "record" is required');
    done();
  });

  test('should throw an error if pass a field that does not exist', async (done) => {
    await expect(
      global.asyncAirtable.createRecord(process.env.AIRTABLE_TABLE, {
        gringle: 'grangle',
      }),
    ).rejects.toThrowError(/UNKNOWN_FIELD_NAME/g);
    done();
  });

  test('should throw an error if pass a field with the incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.createRecord(process.env.AIRTABLE_TABLE, {
        ...JSON.parse(process.env.NEW_RECORD),
        value: 'nope',
      }),
    ).rejects.toThrowError(/INVALID_VALUE_FOR_COLUMN/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      // @ts-ignore
      global.asyncAirtable.createRecord(10, JSON.parse(process.env.NEW_RECORD)),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the record argument with an incorrect data type', async (done) => {
    await expect(
      // @ts-ignore
      global.asyncAirtable.createRecord(process.env.AIRTABLE_TABLE, 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should retry if rate limited', async (done) => {
    let results = [];
    for (let i = 0; i < parseInt(process.env.REQ_COUNT); i++) {
      results.push(
        global.asyncAirtable.createRecord(
          process.env.AIRTABLE_TABLE,
          JSON.parse(process.env.NEW_RECORD),
        ),
      );
    }
    const data = await Promise.all(results);
    data.forEach((result) => {
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBeGreaterThan(0);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('fields');
      expect(result).toHaveProperty('createdTime');
      expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    });
    done();
  });
});

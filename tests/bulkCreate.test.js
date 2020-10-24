let created;
let deleteGroup = [];
describe('.bulkCreate', () => {
  test('should create a new entry in the table with the given fields', async (done) => {
    const results = await global.asyncAirtable.bulkCreate(
      process.env.AIRTABLE_TABLE,
      [JSON.parse(process.env.NEW_RECORD), JSON.parse(process.env.NEW_RECORD)],
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
    created = results[0];
    results.map((result) => {
      deleteGroup.push(result.id);
    });
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
    await expect(global.asyncAirtable.bulkCreate()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if you do not pass a record', async (done) => {
    await expect(
      global.asyncAirtable.bulkCreate(process.env.AIRTABLE_TABLE),
    ).rejects.toThrowError('Argument "records" is required');
    done();
  });

  test('should throw an error if pass a field that does not exist', async (done) => {
    await expect(
      global.asyncAirtable.bulkCreate(process.env.AIRTABLE_TABLE, [
        {
          gringle: 'grangle',
        },
      ]),
    ).rejects.toThrowError(/UNKNOWN_FIELD_NAME/g);
    done();
  });

  test('should throw an error if pass a field with the incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.bulkCreate(process.env.AIRTABLE_TABLE, [
        { ...JSON.parse(process.env.NEW_RECORD), value: 'nope' },
      ]),
    ).rejects.toThrowError(/INVALID_VALUE_FOR_COLUMN/g);
    done();
  });

  test('should throw an error if pass the table argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.bulkCreate(10, JSON.parse(process.env.NEW_RECORD)),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should throw an error if pass the record argument with an incorrect data type', async (done) => {
    await expect(
      global.asyncAirtable.bulkCreate(process.env.AIRTABLE_TABLE, 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should retry if rate limited', async (done) => {
    let results = [];
    for (let i = 0; i < parseInt(process.env.REQ_COUNT); i++) {
      results.push(
        global.asyncAirtable.bulkCreate(process.env.AIRTABLE_TABLE, [
          JSON.parse(process.env.NEW_RECORD),
          JSON.parse(process.env.NEW_RECORD),
        ]),
      );
    }
    const data = await Promise.all(results);
    data.forEach((results) => {
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(result.id).toBeDefined();
        expect(result.fields).toBeDefined();
        expect(Object.keys(result.fields).length).toBeGreaterThan(0);
        expect(result.createdTime).toBeDefined();
      });
    });
    done();
  });
});

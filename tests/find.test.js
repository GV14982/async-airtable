let firstResult;
let secondResult;
let compare;
describe('.find', () => {
  beforeAll(async (done) => {
    const testResult = await global.asyncAirtable.select(
      process.env.AIRTABLE_TABLE,
      {
        maxRecords: 2,
      },
    );
    firstResult = testResult[0];
    secondResult = testResult[1];
    done();
  });

  test('should find a specific record by Airtable ID', async (done) => {
    const result = await global.asyncAirtable.find(
      process.env.AIRTABLE_TABLE,
      firstResult.id,
    );
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.fields).toBeDefined();
    expect(result.createdTime).toBeDefined();
    expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    compare = result;
    done();
  });

  test('should find a different specific record by Airtable ID', async (done) => {
    const result = await global.asyncAirtable.find(
      process.env.AIRTABLE_TABLE,
      secondResult.id,
    );
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.fields).toBeDefined();
    expect(result.createdTime).toBeDefined();
    expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    expect(JSON.stringify(result)).not.toEqual(JSON.stringify(compare));
    done();
  });

  test('should throw an error if you do not pass a table', async (done) => {
    await expect(global.asyncAirtable.find()).rejects.toThrowError(
      'Argument "table" is required',
    );
    done();
  });

  test('should throw an error if the table does not exist', async (done) => {
    await expect(
      global.asyncAirtable.find('doesnotexist', firstResult.id),
    ).rejects.toThrowError(/"TABLE_NOT_FOUND"/g);
    done();
  });

  test('should throw an error if you pass an incorrect data type for table', async (done) => {
    await expect(global.asyncAirtable.find(10)).rejects.toThrowError(
      /Incorrect data type/g,
    );
    done();
  });

  test('should throw an error if you do not pass an id', async (done) => {
    await expect(
      global.asyncAirtable.find(process.env.AIRTABLE_TABLE),
    ).rejects.toThrowError('Argument "id" is required');
    done();
  });

  test('should throw an error if the id does not exist', async (done) => {
    await expect(
      global.asyncAirtable.find(process.env.AIRTABLE_TABLE, 'doesnotexist'),
    ).rejects.toThrowError(/"NOT_FOUND"/g);
    done();
  });

  test('should throw an error if you pass an incorrect data type for table', async (done) => {
    await expect(
      global.asyncAirtable.find(process.env.AIRTABLE_TABLE, 10),
    ).rejects.toThrowError(/Incorrect data type/g);
    done();
  });

  test('should retry after 30 seconds if rate limited', async (done) => {
    let results = [];
    for (let i = 0; i < 150; i++) {
      results.push(
        global.asyncAirtable.find(process.env.AIRTABLE_TABLE, firstResult.id),
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

let initResult;
describe('.update( (DESTRUCTIVE)', () => {
  beforeAll(async (done) => {
    initResult = await global.asyncAirtable.find(
      process.env.AIRTABLE_TABLE,
      process.env.DESTRUCTIVE_UPDATE_RECORD_ID,
    );
    done();
  });

  afterAll(async (done) => {
    await global.asyncAirtable.update(
      process.env.AIRTABLE_TABLE,
      JSON.parse(process.env.DESTRUCTIVE_UPDATE_RECORD_RESET),
    );
    done();
  });

  test('should update a record and set unprovided field to null', async (done) => {
    const result = await global.asyncAirtable.update(
      process.env.AIRTABLE_TABLE,
      JSON.parse(process.env.DESTRUCTIVE_UPDATE_RECORD),
      true,
    );
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);
    expect(result.id).toBeDefined();
    expect(result.fields).toBeDefined();
    expect(result.createdTime).toBeDefined();
    expect(Object.keys(result.fields).length).toBeGreaterThan(0);
    expect(JSON.stringify(result)).not.toEqual(JSON.stringify(initResult));
    expect(result).not.toHaveProperty(
      process.env.DESTRUCTIVE_UPDATE_NULL_FIELD,
    );
    done();
  });
});

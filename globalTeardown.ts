import {config} from 'dotenv';
config()
module.exports = async () => {
  const data = await global.asyncAirtable.select(process.env.AIRTABLE_TABLE);
  let deleted = [];
  for (let i = 0; i < data.length; i += 10) {
    const records = data.slice(i, i + 10).map((record) => record.id);
    const values = await global.asyncAirtable.bulkDelete(
      process.env.AIRTABLE_TABLE,
      records,
    );
    deleted = deleted.concat(values);
  }
  if (deleted.length === data.length) {
    //eslint-disable-next-line
    console.log('Table cleared. 🧹');
  }
};

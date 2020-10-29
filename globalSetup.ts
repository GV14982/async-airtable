import {config} from 'dotenv';
config()
import data from './testData.json';

module.exports = async () => {
  let created = [];
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < data.length; i += 10) {
      const records = data.slice(i, i + 10).map((record) => record.fields);
      const values = await global.asyncAirtable.bulkCreate(
        process.env.AIRTABLE_TABLE,
        records,
      );
      created = created.concat(values);
    }
  }
  if (created.length == data.length * 2) {
    //eslint-disable-next-line
    console.log('\nTable seeded.🌱');
  }
};

import { config } from 'dotenv';
config();
import { AsyncAirtable } from '../asyncAirtable';
import { AirtableRecord, DeleteResponse } from '../@types';
const asyncAirtable = new AsyncAirtable(
  process.env.AIRTABLE_KEY || '',
  process.env.AIRTABLE_BASE || '',
);
module.exports = async () => {
  const data: AirtableRecord[] = await asyncAirtable.select(
    process.env.AIRTABLE_TABLE || '',
  );
  let deleted: DeleteResponse[] = [];
  for (let i = 0; i < data.length; i += 10) {
    const records = data.slice(i, i + 10).map((record) => record.id);
    const values = await asyncAirtable.bulkDelete(
      process.env.AIRTABLE_TABLE || '',
      records,
    );
    deleted = deleted.concat(values);
  }
  if (deleted.length === data.length) {
    //eslint-disable-next-line
    console.log('Table cleared. 🧹');
  }
};

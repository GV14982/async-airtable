import AsyncAirtable from '../asyncAirtable';
declare global {
  namespace NodeJS {
    interface Global {
      document: Document;
      window: Window;
      navigator: Navigator;
      AsyncAirtable: any;
      asyncAirtable: AsyncAirtable;
    }
  }
}
require('dotenv').config();
global.AsyncAirtable = AsyncAirtable;
global.asyncAirtable = new AsyncAirtable(
  process.env.AIRTABLE_KEY || '',
  process.env.AIRTABLE_BASE || '',
);

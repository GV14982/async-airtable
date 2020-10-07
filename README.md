# Async Airtable

[![YourActionName Actions Status](https://github.com/gv14982/async-airtable/workflows/Tests/badge.svg)](https://github.com/gv14982/async-airtable/actions)
[![Coverage Status](https://coveralls.io/repos/github/GV14982/async-airtable/badge.svg?branch=master)](https://coveralls.io/github/GV14982/async-airtable?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AsyncAirtable is a lightweight npm package to handle working with the [Airtable API](https://airtable.com/api).

They have an existing library, but it is callback based and can get a little klunky at times, so I wrote this one that is promise based to make your life easier 😊.

## Requirements

- NodeJS
- npm

## Installation

```
npm install asyncairtable
```

## Usage

```javascript
const AsyncAirtable = require('async-airtable');
const asyncAirtable = new AsyncAirtable(API_KEY, BASE_ID);

asyncAirtable.select(TABLE_NAME, { ...OPTS }, PAGE_NUM);
asyncAirtable.find(TABLE_NAME, RECORD_ID);
asyncAirtable.create(TABLE_NAME, { ...FIELDS });
asyncAirtable.update(TABLE_NAME, { RECORD_ID, ...FIELDS });
asyncAirtable.delete(TABLE_NAME, RECORD_ID);
asyncAirtable.bulkCreate(TABLE_NAME, [
  { ...FIELDS },
  { ...FIELDS },
  { ...FIELDS },
]);
asyncAirtable.bulkUpdate(TABLE_NAME, [
  { RECORD_ID, ...FIELDS },
  { RECORD_ID, ...FIELDS },
]);
asyncAirtable.bulkDelete(TABLE_NAME, [
  RECORD_ID,
  RECORD_ID,
  RECORD_ID,
  RECORD_ID,
]);
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

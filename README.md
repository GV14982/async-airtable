# Async Airtable

[![Build: Tests](https://img.shields.io/github/workflow/status/GV14982/async-airtable/next?label=Next&logo=jest&logoColor=white&style=flat)](https://github.com/gv14982/async-airtable/actions)
[![Build: Tests](https://img.shields.io/github/workflow/status/GV14982/async-airtable/main?label=Main&logo=jest&logoColor=white&style=flat)](https://github.com/gv14982/async-airtable/actions)
[![npm](https://img.shields.io/npm/v/asyncairtable)](https://www.npmjs.com/package/asyncairtable)
[![npm (tag)](https://img.shields.io/npm/v/asyncairtable/next)](https://www.npmjs.com/package/asyncairtable)
[![MIT License](https://img.shields.io/github/license/GV14982/async-airtable?style=flat)](LICENSE.md)

AsyncAirtable is a lightweight npm package to handle working with the [Airtable API](https://airtable.com/api).

They have an existing library, but it is callback based and can get a little klunky at times, so I wrote this one that is promise based to make your life easier 😊.

I also wrote a query builder so, instead of having to write those really annyoying [filter formula strings](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference#array_functions) you can just use an object like:

```
{
  where: {
    name: 'AsyncAirtable',
    $gte: {stars: 13}
  }
}
```

which will generate the following filterFormula string for you: `AND({name} = 'AsyncAirtable', {stars} >= 13)`

## Requirements

- NodeJS
- npm
- [Airtable account](https://airtable.com/signup)

## Installation

- Be sure get your [API key](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-)

- To get the base ID of your new base. You can do this by heading over to [Airtable's API page](https://airtable.com/api) and selecting that base from the list, you should see:

  > The ID of this base is BASE_ID

- Install all dependancies:

```
npm install asyncairtable
```

Then you should be good to go!👍

## Browser

If you want to use AsyncAirtable in a browser, please use the files in the `./dist` folder. There is a regular and a minified version.

They are also available via [unpkg.com](https://unpkg.com/):

- [Regular](https://unpkg.com/asyncairtable/dist/asyncAirtable.js)
- [Minified](https://unpkg.com/asyncairtable/dist/asyncAirtable.min.js)

## Usage

```javascript
const AsyncAirtable = require('async-airtable'); // or import { AsyncAirtable } from 'asyncairtable';
const asyncAirtable = new AsyncAirtable(API_KEY, BASE_ID, { ...CONFIG });
```

## Documentation

To setup documentation run:
`npm run doc`

This will generate a _docs_ folder. Just open or serve _index.html_ and you will have the docs!

You can also view them [online](https://asyncairtable.com).

## License

[MIT](https://choosealicense.com/licenses/mit/)

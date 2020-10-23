const nodeFetch = require('node-fetch');
const buildOpts = require('./buildOpts');
const checkError = require('./checkError');
const checkArg = require('./checkArg');
const rateLimitHandler = require('./rateLimitHandler');
const baseURL = 'https://api.airtable.com/v0';

/**
 * @typedef Options
 * @type {Object}
 * @description An object of possible options. This object cannot be initialized, it is for reference only.
 * @property {string[]} [fields] - An array of specific field names to be returned. Returns all fields if none are supplied.
 * @property {string} [filterByFormula] - A [formula used](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) to filter the records
 * @property {number} [maxRecords=100] - The maximum total number of records that will be returned in your requests. Should be smaller than or equal to `pageSize`.
 * @property {number} [pageSize=100] - The number of records returned in each request. Must be less than or equal to 100.
 * @property {Object[]} [sort] -
 * A list of sort objects that specifies
 * how the records will be ordered.
 * Each sort object must have a field key
 * specifying the name of the field to sort on,
 * and an optional direction key that is either
 * "asc" or "desc". The default direction is "asc".
 * ```
 * [
 *   {
 *     field: "title",
 *     direction: "desc"
 *   },
 *   {
 *     field: "date",
 *     direction: "asc"
 *   }
 * ]
 * ```
 * @property {string} [view] -
 * The name or id of a view on the specified table.
 * If set, only the records in that view will be returned.
 * The records will be sorted according to the order
 * of the view unless the sort parameter is included,
 * which overrides that order. Fields hidden in this view
 * will be returned in the results. To only return
 * a subset of fields, use the fields parameter.
 */
const validOptions = [
  'fields',
  'filterByFormula',
  'maxRecords',
  'pageSize',
  'sort',
  'view',
];

/**
 * @typedef Record
 * @type {Object}
 * @name Record
 * @description  An object of the properties. This object cannot be initialized, it is for reference only.
 * @example
 * {
 *   "id": "recABCDEFGHIJK",
 *   "title": "hello",
 *   "description": "world"
 * }
 * @property {string} [id] - Airtable Record ID (only needed for updates)
 * @property {any} ...fields - Add a separate property for each field
 */

/**
 * The main AsyncAirtable Library
 * @class
 */
class AsyncAirtable {
  retryOnRateLimit = true;

  /**
   * Creates a new instance of the AsyncAirtable library.
   * @constructor
   * @param {string} apiKey - The API Key from AirTable
   * @param {string} base - The base id from AirTable
   */
  constructor(apiKey, base, opts) {
    if (!apiKey) throw new Error('API Key is required.');
    if (!base) throw new Error('Base ID is required.');
    this.apiKey = apiKey;
    this.base = base;
    if (opts) {
      Object.keys(opts).forEach((key) => {
        this[key] = opts[key];
      });
    }
  }

  /**
   * Select record(s) from the specified table.
   * @method
   * @param {string} table - Table name
   * @param {Options} [options] - Options object, used to filter records
   * @param {number} [page] - Used to get a specific page of records
   */
  select = async (table, options = undefined, page = undefined) => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(options, 'options', 'object');
      checkArg(page, 'page', 'number');
      let url = `${baseURL}/${this.base}/${table}`;
      const opts = options ? { ...options } : {};
      Object.keys(opts).forEach((option) => {
        if (!validOptions.includes(option)) {
          throw new Error(`Invalid option: ${option}`);
        }
      });
      let offset;
      if (page) {
        for (let i = 0; i < page; i++) {
          if (offset) {
            opts.offset = offset;
          }
          try {
            const res = await nodeFetch(`${url}?${buildOpts(opts)}`, {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            });
            const body = await res.json();
            if (checkError(res.status)) {
              if (res.status !== 429) {
                throw new Error(JSON.stringify(body));
              }

              if (this.retryOnRateLimit) {
                if (i + 1 === page) {
                  return await rateLimitHandler(
                    `${url}?${buildOpts(opts)}`,
                    {
                      headers: { Authorization: `Bearer ${this.apiKey}` },
                    },
                    'records',
                  );
                }
              }
            }
            if (i + 1 === page) {
              return body.records;
            }
            offset = body.offset;
          } catch (err) {
            throw new Error(err);
          }
        }
      } else {
        let done = false;
        let data = [];
        while (!done) {
          if (offset) {
            opts.offset = offset;
          }
          try {
            const res = await nodeFetch(`${url}?${buildOpts(opts)}`, {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            });
            const body = await res.json();
            if (checkError(res.status)) {
              if (res.status !== 429) {
                throw new Error(JSON.stringify(body));
              }

              if (this.retryOnRateLimit) {
                return await rateLimitHandler(
                  `${url}?${buildOpts(opts)}`,
                  {
                    headers: { Authorization: `Bearer ${this.apiKey}` },
                  },
                  'records',
                );
              }
            }
            data = data.concat(body.records);
            offset = body.offset;
            if (!body.offset) {
              done = true;
            }
          } catch (err) {
            throw new Error(err);
          }
        }
        return data;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  /**
   * Finds a record on the specified table.
   * @method
   * @param {string} table - Table name
   * @param {string} id - Airtable record ID
   */
  find = async (table, id) => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(id, 'id', 'string', true);
      let url = `${baseURL}/${this.base}/${table}/${id}`;
      const res = await nodeFetch(url, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        if (res.status !== 429) {
          throw new Error(JSON.stringify(data));
        }

        if (this.retryOnRateLimit) {
          return await rateLimitHandler(url, {
            headers: { Authorization: `Bearer ${this.apiKey}` },
          });
        }
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  };

  /**
   * Creates a new record on the specified table.
   * @method
   * @param {string} table - Table name
   * @param {object} record - Record object, used to structure data for insert
   */
  createRecord = async (table, record) => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(record, 'record', 'object', true);
      let url = `${baseURL}/${this.base}/${table}`;
      const body = { fields: record };
      const res = await nodeFetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        if (res.status !== 429) {
          throw new Error(JSON.stringify(data));
        }

        if (this.retryOnRateLimit) {
          return await rateLimitHandler(url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          });
        }
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  };

  /**
   * Updates a record on the specified table.
   * @method
   * @param {string} table - Table name
   * @param {object} record - Record object, used to update data within a specific record
   * @param {boolean} [destructive=false] - (Dis-)Allow a destructive update
   */
  updateRecord = async (table, record, destructive = false) => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(record, 'record', 'object', true);
      let url = `${baseURL}/${this.base}/${table}/${record.id}`;
      const fields = {};
      Object.keys(record).forEach((key) => {
        if (key !== 'id') fields[key] = record[key];
      });
      const res = await nodeFetch(url, {
        method: destructive ? 'put' : 'patch',
        body: JSON.stringify({ fields }),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        if (res.status !== 429) {
          throw new Error(JSON.stringify(data));
        }

        if (this.retryOnRateLimit) {
          return await rateLimitHandler(url, {
            method: destructive ? 'put' : 'patch',
            body: JSON.stringify({ fields }),
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          });
        }
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  };

  /**
   * Deletes a record from the specified table.
   * @method
   * @param {string} table - Table name
   * @param {string} id - Airtable record ID
   */
  deleteRecord = async (table, id) => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(id, 'id', 'string', true);
      let url = `${baseURL}/${this.base}/${table}/${id}`;
      const res = await nodeFetch(url, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        if (res.status !== 429) {
          throw new Error(JSON.stringify(data));
        }

        if (this.retryOnRateLimit) {
          return await rateLimitHandler(url, {
            method: 'delete',
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
          });
        }
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  };

  /**
   * Creates multiple new records on the specified table.
   * @method
   * @param {string} table - Table name
   * @param {Array<Record>} records - An array of Record objects
   */
  bulkCreate = async (table, records) => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(records, 'records', 'object', true);
      let url = `${baseURL}/${this.base}/${table}`;
      const body = records.map((record) => ({
        fields: record,
      }));
      const res = await nodeFetch(url, {
        method: 'post',
        body: JSON.stringify({ records: body }),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        if (res.status !== 429) {
          throw new Error(JSON.stringify(data));
        }

        if (this.retryOnRateLimit) {
          return await rateLimitHandler(
            url,
            {
              method: 'post',
              body: JSON.stringify({ records: body }),
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
              },
            },
            'records',
          );
        }
      }
      return data.records;
    } catch (err) {
      throw new Error(err);
    }
  };

  /**
   * Updates multiple records on the specified table
   * @method
   * @param {string} table - Table name
   * @param {Array<Record>} records - An array of Record objects
   */
  bulkUpdate = async (table, records) => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(records, 'records', 'object', true);
      let url = `${baseURL}/${this.base}/${table}`;
      const body = records.map((record) => {
        const id = record.id;
        const fields = {};
        Object.keys(record).forEach((key) => {
          if (key !== 'id') fields[key] = record[key];
        });
        return { id, fields };
      });
      const res = await nodeFetch(url, {
        method: 'patch',
        body: JSON.stringify({ records: body }),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        if (res.status !== 429) {
          throw new Error(JSON.stringify(data));
        }

        if (this.retryOnRateLimit) {
          return await rateLimitHandler(
            url,
            {
              method: 'patch',
              body: JSON.stringify({ records: body }),
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
              },
            },
            'records',
          );
        }
      }
      return data.records;
    } catch (err) {
      throw new Error(err);
    }
  };

  /**
   * Deletes multiple records from the specified table
   * @method
   * @param {string} table - Table name
   * @param {Array<string>} ids - Array of Airtable record IDs
   */
  bulkDelete = async (table, ids) => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(ids, 'ids', 'object', true);
      let query = '';
      ids.forEach((id, i) => {
        if (i !== 0) {
          query = `${query}&records[]=${id}`;
        } else {
          query = `records[]=${id}`;
        }
      });
      let url = `${baseURL}/${this.base}/${table}?${encodeURI(query)}`;
      const res = await nodeFetch(url, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        if (res.status !== 429) {
          throw new Error(JSON.stringify(data));
        }

        if (this.retryOnRateLimit) {
          return await rateLimitHandler(
            url,
            {
              method: 'delete',
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
              },
            },
            'records',
          );
        }
      }
      return data.records;
    } catch (err) {
      throw new Error(err);
    }
  };
}

module.exports = AsyncAirtable;

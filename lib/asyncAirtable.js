'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const node_fetch_1 = require('node-fetch');
const buildOpts_1 = require('./buildOpts');
const checkError_1 = require('./checkError');
const checkArg_1 = require('./checkArg');
const rateLimitHandler_1 = require('./rateLimitHandler');
const baseURL = 'https://api.airtable.com/v0';
/**
 * @typedef Options
 * @type {Object}
 * @description An object of possible options. This object cannot be initialized, it is for reference only.
 * @property {string[]} [fields] - An array of specific field names to be returned. Returns all fields if none are supplied.
 * @property {string} [filterByFormula] - A [formula used](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) to filter the records
 * @property {number} [maxRecords=100] - The maximum total number of records that will be returned in your requests. Should be smaller than or equal to `pageSize`.
 * @property {number} [pageSize=100] - The number of records returned in each request. Must be less than or equal to 100.
 * @property {SortOption[]} [sort] - A list of sort objects that specifies how the records will be ordered.
 * @property {string} [view] -
 * The name or id of a view on the specified table.
 * If set, only the records in that view will be returned.
 * The records will be sorted according to the order
 * of the view unless the sort parameter is included,
 * which overrides that order. Fields hidden in this view
 * will be returned in the results. To only return
 * a subset of fields, use the fields parameter.
 * @example
 * * {
 *    fields: ['name', 'email', 'date'],
 *    filterByFormula: "{name} = 'Paul'",
 *    maxRecords: 50,
 *    pageSize: 10,
 *    sort: [
 *      {
 *        field: "name",
 *        direction: "desc"
 *      },
 *      {
 *        field: "date",
 *        direction: "asc"
 *      }
 *    ],
 *    view: 'Grid view'
 * }
 */
/**
 * @typedef SortOption
 * @type {Object}
 * @property {string} field - The field name you want to sort by
 * @property {string} [direction='asc'] - The direction of the sort
 * @example
 * {
 *    field: "name",
 *    direction: "desc"
 * }
 */
/**
 * @typedef DeleteResponse
 * @type {Object}
 * @property {string} [id] - ID of the deleted record
 * @property {boolean} deleted - Status if a record was deleted
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
 *   id: "recABCDEFGHIJK",
 *   title: "hello",
 *   description: "world"
 * }
 * @property {string} [id] - Airtable Record ID (only needed for updates)
 * @property {any} ...fields - Add a separate property for each field
 */
/**
 * @typedef Config
 * @type {Object}
 * @description An optional object used to instatiate AsyncAirtable
 * @example
 * {
 *    "retryOnRateLimit": true,
 *    "maxRetry": 60000,
 *    "retryTimeout": 5000
 * }
 * @property {boolean} [retryOnRateLimit=true] - This decides whether or not the library will handle retrying a request when rate limited
 * @property {number} [maxRetry=60000] - The maxmium amount of time before the library will stop retrying and timeout when rate limited
 * @property {number} [maxRetry=5000] - The starting timeout for the retry. This will get 50% larger with each try until you hit the maxRetry amount
 */
/**
 * The main AsyncAirtable Library
 * @class
 */
class AsyncAirtable {
  /**
   * Creates a new instance of the AsyncAirtable library.
   * @constructor
   * @param {string} apiKey - The API Key from AirTable
   * @param {string} base - The base id from AirTable
   * @param {Config} config - The config to use for this instance of AsyncAirtable
   */
  constructor(apiKey, base, config) {
    /**
     * Select record(s) from the specified table.
     * @method
     * @param {string} table - Table name
     * @param {Options} [options] - Options object, used to filter records
     * @param {number} [page] - Used to get a specific page of records
     * @returns {Promise<Record[]>}
     */
    this.select = (table, options, page) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          checkArg_1.default(table, 'table', 'string', true);
          checkArg_1.default(options, 'options', 'object');
          checkArg_1.default(page, 'page', 'number');
          let url = `${baseURL}/${this.base}/${table}`;
          const opts = options ? Object.assign({}, options) : {};
          Object.keys(opts).forEach((option) => {
            if (!validOptions.includes(option)) {
              throw new Error(`Invalid option: ${option}`);
            }
          });
          let offset = '';
          let data = [];
          if (page) {
            for (let i = 0; i < page; i++) {
              if (offset) {
                opts.offset = offset;
              }
              try {
                const res = yield node_fetch_1.default(
                  `${url}?${buildOpts_1.default(opts)}`,
                  {
                    headers: { Authorization: `Bearer ${this.apiKey}` },
                  },
                );
                const body = yield res.json();
                if (checkError_1.default(res.status)) {
                  if (res.status !== 429) {
                    throw new Error(JSON.stringify(body));
                  }
                  if (this.retryOnRateLimit) {
                    if (i + 1 === page) {
                      return yield rateLimitHandler_1.default(
                        `${url}?${buildOpts_1.default(opts)}`,
                        {
                          headers: { Authorization: `Bearer ${this.apiKey}` },
                        },
                        this.retryTimeout,
                        this.maxRetry,
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
            while (!done) {
              if (offset) {
                opts.offset = offset;
              }
              try {
                const res = yield node_fetch_1.default(
                  `${url}?${buildOpts_1.default(opts)}`,
                  {
                    headers: { Authorization: `Bearer ${this.apiKey}` },
                  },
                );
                const body = yield res.json();
                if (checkError_1.default(res.status)) {
                  if (res.status !== 429) {
                    throw new Error(JSON.stringify(body));
                  }
                  if (this.retryOnRateLimit) {
                    return yield rateLimitHandler_1.default(
                      `${url}?${buildOpts_1.default(opts)}`,
                      {
                        headers: { Authorization: `Bearer ${this.apiKey}` },
                      },
                      this.retryTimeout,
                      this.maxRetry,
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
          return data;
        } catch (err) {
          throw new Error(err);
        }
      });
    /**
     * Finds a record on the specified table.
     * @method
     * @param {string} table - Table name
     * @param {string} id - Airtable record ID
     * @returns {Promise<Record>}
     */
    this.find = (table, id) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          checkArg_1.default(table, 'table', 'string', true);
          checkArg_1.default(id, 'id', 'string', true);
          let url = `${baseURL}/${this.base}/${table}/${id}`;
          const res = yield node_fetch_1.default(url, {
            headers: { Authorization: `Bearer ${this.apiKey}` },
          });
          const data = yield res.json();
          if (checkError_1.default(res.status)) {
            if (res.status !== 429) {
              throw new Error(JSON.stringify(data));
            }
            if (this.retryOnRateLimit) {
              return yield rateLimitHandler_1.default(
                url,
                {
                  headers: { Authorization: `Bearer ${this.apiKey}` },
                },
                this.retryTimeout,
                this.maxRetry,
              );
            }
          }
          return data;
        } catch (err) {
          throw new Error(err);
        }
      });
    /**
     * Creates a new record on the specified table.
     * @method
     * @param {string} table - Table name
     * @param {object} record - Record object, used to structure data for insert
     * @returns {Promise<Record>}
     */
    this.createRecord = (table, record) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          checkArg_1.default(table, 'table', 'string', true);
          checkArg_1.default(record, 'record', 'object', true);
          let url = `${baseURL}/${this.base}/${table}`;
          const body = { fields: record };
          const res = yield node_fetch_1.default(url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          const data = yield res.json();
          if (checkError_1.default(res.status)) {
            if (res.status !== 429) {
              throw new Error(JSON.stringify(data));
            }
            if (this.retryOnRateLimit) {
              return yield rateLimitHandler_1.default(
                url,
                {
                  method: 'post',
                  body: JSON.stringify(body),
                  headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                  },
                },
                this.retryTimeout,
                this.maxRetry,
              );
            }
          }
          return data;
        } catch (err) {
          throw new Error(err);
        }
      });
    /**
     * Updates a record on the specified table.
     * @method
     * @param {string} table - Table name
     * @param {object} record - Record object, used to update data within a specific record
     * @param {boolean} [destructive=false] - (Dis-)Allow a destructive update
     * @returns {Promise<Record>}
     */
    this.updateRecord = (table, record, destructive = false) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          checkArg_1.default(table, 'table', 'string', true);
          checkArg_1.default(record, 'record', 'object', true);
          let url = `${baseURL}/${this.base}/${table}/${record.id}`;
          const fields = {};
          Object.keys(record).forEach((key) => {
            if (key !== 'id') fields[key] = record[key];
          });
          const res = yield node_fetch_1.default(url, {
            method: destructive ? 'put' : 'patch',
            body: JSON.stringify({ fields }),
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          const data = yield res.json();
          if (checkError_1.default(res.status)) {
            if (res.status !== 429) {
              throw new Error(JSON.stringify(data));
            }
            if (this.retryOnRateLimit) {
              return yield rateLimitHandler_1.default(
                url,
                {
                  method: destructive ? 'put' : 'patch',
                  body: JSON.stringify({ fields }),
                  headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                  },
                },
                this.retryTimeout,
                this.maxRetry,
              );
            }
          }
          return data;
        } catch (err) {
          throw new Error(err);
        }
      });
    /**
     * Deletes a record from the specified table.
     * @method
     * @param {string} table - Table name
     * @param {string} id - Airtable record ID
     * @returns {Promise<DeleteResponse>}
     */
    this.deleteRecord = (table, id) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          checkArg_1.default(table, 'table', 'string', true);
          checkArg_1.default(id, 'id', 'string', true);
          let url = `${baseURL}/${this.base}/${table}/${id}`;
          const res = yield node_fetch_1.default(url, {
            method: 'delete',
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
          });
          const data = yield res.json();
          if (checkError_1.default(res.status)) {
            if (res.status !== 429) {
              throw new Error(JSON.stringify(data));
            }
            if (this.retryOnRateLimit) {
              return yield rateLimitHandler_1.default(
                url,
                {
                  method: 'delete',
                  headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                  },
                },
                this.retryTimeout,
                this.maxRetry,
              );
            }
          }
          return data;
        } catch (err) {
          throw new Error(err);
        }
      });
    /**
     * Creates multiple new records on the specified table.
     * @method
     * @param {string} table - Table name
     * @param {Array<Record>} records - An array of Record objects
     * @returns {Promise<Record[]>}
     */
    this.bulkCreate = (table, records) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          checkArg_1.default(table, 'table', 'string', true);
          checkArg_1.default(records, 'records', 'object', true);
          let url = `${baseURL}/${this.base}/${table}`;
          const body = records.map((record) => ({
            fields: record,
          }));
          const res = yield node_fetch_1.default(url, {
            method: 'post',
            body: JSON.stringify({ records: body }),
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          const data = yield res.json();
          if (checkError_1.default(res.status)) {
            if (res.status !== 429) {
              throw new Error(JSON.stringify(data));
            }
            if (this.retryOnRateLimit) {
              return yield rateLimitHandler_1.default(
                url,
                {
                  method: 'post',
                  body: JSON.stringify({ records: body }),
                  headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                  },
                },
                this.retryTimeout,
                this.maxRetry,
                'records',
              );
            }
          }
          return data.records;
        } catch (err) {
          throw new Error(err);
        }
      });
    /**
     * Updates multiple records on the specified table
     * @method
     * @param {string} table - Table name
     * @param {Array<Record>} records - An array of Record objects
     * @returns {Promise<Record[]>}
     */
    this.bulkUpdate = (table, records) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          checkArg_1.default(table, 'table', 'string', true);
          checkArg_1.default(records, 'records', 'object', true);
          let url = `${baseURL}/${this.base}/${table}`;
          const body = records.map((record) => {
            const id = record.id;
            const fields = {};
            Object.keys(record).forEach((key) => {
              if (key !== 'id') fields[key] = record[key];
            });
            return { id, fields };
          });
          const res = yield node_fetch_1.default(url, {
            method: 'patch',
            body: JSON.stringify({ records: body }),
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          const data = yield res.json();
          if (checkError_1.default(res.status)) {
            if (res.status !== 429) {
              throw new Error(JSON.stringify(data));
            }
            if (this.retryOnRateLimit) {
              return yield rateLimitHandler_1.default(
                url,
                {
                  method: 'patch',
                  body: JSON.stringify({ records: body }),
                  headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                  },
                },
                this.retryTimeout,
                this.maxRetry,
                'records',
              );
            }
          }
          return data.records;
        } catch (err) {
          throw new Error(err);
        }
      });
    /**
     * Deletes multiple records from the specified table
     * @method
     * @param {string} table - Table name
     * @param {Array<string>} ids - Array of Airtable record IDs
     * @returns {Promise<DeleteResponse[]>}
     */
    this.bulkDelete = (table, ids) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          checkArg_1.default(table, 'table', 'string', true);
          checkArg_1.default(ids, 'ids', 'object', true);
          let query = '';
          ids.forEach((id, i) => {
            if (i !== 0) {
              query = `${query}&records[]=${id}`;
            } else {
              query = `records[]=${id}`;
            }
          });
          let url = `${baseURL}/${this.base}/${table}?${encodeURI(query)}`;
          const res = yield node_fetch_1.default(url, {
            method: 'delete',
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
          });
          const data = yield res.json();
          if (checkError_1.default(res.status)) {
            if (res.status !== 429) {
              throw new Error(JSON.stringify(data));
            }
            if (this.retryOnRateLimit) {
              return yield rateLimitHandler_1.default(
                url,
                {
                  method: 'delete',
                  headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                  },
                },
                this.retryTimeout,
                this.maxRetry,
                'records',
              );
            }
          }
          return data.records;
        } catch (err) {
          throw new Error(err);
        }
      });
    if (!apiKey) throw new Error('API Key is required.');
    if (!base) throw new Error('Base ID is required.');
    this.apiKey = apiKey;
    this.base = base;
    this.retryOnRateLimit =
      (config === null || config === void 0
        ? void 0
        : config.retryOnRateLimit) || true;
    this.retryTimeout =
      (config === null || config === void 0 ? void 0 : config.retryTimeout) ||
      5000;
    this.maxRetry =
      (config === null || config === void 0 ? void 0 : config.maxRetry) ||
      60000;
  }
}
exports.default = AsyncAirtable;

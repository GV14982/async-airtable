import nodeFetch, {Response} from 'node-fetch';
import buildOpts from './buildOpts';
import checkError from './checkError';
import checkArg from './checkArg';
import rateLimitHandler from './rateLimitHandler';
import { AirtableRecord, Config, DeleteResponse, SelectOptions, Fields } from '../types/common';
const baseURL = 'https://api.airtable.com/v0';

interface AirtableRecordResponse {
  records: AirtableRecord[],
  offset?: string
}

interface AirtableDeletedResponse {
  records: DeleteResponse[]
}

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

const validOptions: string[] = [
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
export default class AsyncAirtable {
  retryOnRateLimit: boolean;
  maxRetry: number;
  retryTimeout: number;
  apiKey: string;
  base: string;

  /**
   * Creates a new instance of the AsyncAirtable library.
   * @constructor
   * @param {string} apiKey - The API Key from AirTable
   * @param {string} base - The base id from AirTable
   * @param {Config} config - The config to use for this instance of AsyncAirtable
   */
  constructor(apiKey: string, base: string, config?: Config) {
    if (!apiKey) throw new Error('API Key is required.');
    if (!base) throw new Error('Base ID is required.');
    this.apiKey = apiKey;
    this.base = base;
    this.retryOnRateLimit = config?.retryOnRateLimit || true;
    this.retryTimeout = config?.retryTimeout || 5000;
    this.maxRetry = config?.maxRetry || 60000;
  }

  /**
   * Select record(s) from the specified table.
   * @method
   * @param {string} table - Table name
   * @param {Options} [options] - Options object, used to filter records
   * @param {number} [page] - Used to get a specific page of records
   * @returns {Promise<Record[]>}
   */
  select = async (table: string, options?: SelectOptions, page?: number): Promise<AirtableRecord[] | undefined> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(options, 'options', 'object');
      checkArg(page, 'page', 'number');
      let url = `${baseURL}/${this.base}/${table}`;
      const opts: SelectOptions = options ? { ...options } : {};
      Object.keys(opts).forEach((option) => {
        if (!validOptions.includes(option)) {
          throw new Error(`Invalid option: ${option}`);
        }
      });
      let offset: string | undefined = '';
      if (page) {
        for (let i = 0; i < page; i++) {
          if (offset) {
            opts.offset = offset;
          }
          try {
            const res: Response = await nodeFetch(`${url}?${buildOpts(opts)}`, {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            });
            const body: AirtableRecordResponse = await res.json();
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
        let data: AirtableRecord[] = [];
        while (!done) {
          if (offset) {
            opts.offset = offset;
          }
          try {
            const res: Response = await nodeFetch(`${url}?${buildOpts(opts)}`, {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            });
            const body: AirtableRecordResponse = await res.json();
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
    } catch (err) {
      throw new Error(err);
    }
  };

  /**
   * Finds a record on the specified table.
   * @method
   * @param {string} table - Table name
   * @param {string} id - Airtable record ID
   * @returns {Promise<Record>}
   */
  find = async (table: string, id: string): Promise<AirtableRecord> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(id, 'id', 'string', true);
      let url = `${baseURL}/${this.base}/${table}/${id}`;
      const res: Response = await nodeFetch(url, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      const data: AirtableRecord = await res.json();
      if (checkError(res.status)) {
        if (res.status !== 429) {
          throw new Error(JSON.stringify(data));
        }

        if (this.retryOnRateLimit) {
          return await rateLimitHandler(
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
  };

  /**
   * Creates a new record on the specified table.
   * @method
   * @param {string} table - Table name
   * @param {object} record - Record object, used to structure data for insert
   * @returns {Promise<Record>}
   */
  createRecord = async (table: string, record: Fields): Promise<AirtableRecord> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(record, 'record', 'object', true);
      let url = `${baseURL}/${this.base}/${table}`;
      const body = { fields: record };
      const res: Response = await nodeFetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      const data: AirtableRecord = await res.json();
      if (checkError(res.status)) {
        if (res.status !== 429) {
          throw new Error(JSON.stringify(data));
        }

        if (this.retryOnRateLimit) {
          return await rateLimitHandler(
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
  };

  /**
   * Updates a record on the specified table.
   * @method
   * @param {string} table - Table name
   * @param {object} record - Record object, used to update data within a specific record
   * @param {boolean} [destructive=false] - (Dis-)Allow a destructive update
   * @returns {Promise<Record>}
   */
  updateRecord = async (table: string, record: Fields, destructive = false): Promise<AirtableRecord> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(record, 'record', 'object', true);
      let url = `${baseURL}/${this.base}/${table}/${record.id}`;
      const fields: Fields = {};
      Object.keys(record).forEach((key) => {
        if (key !== 'id') fields[key] = record[key];
      });
      const res: Response = await nodeFetch(url, {
        method: destructive ? 'put' : 'patch',
        body: JSON.stringify({ fields }),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      const data: AirtableRecord = await res.json();
      if (checkError(res.status)) {
        if (res.status !== 429) {
          throw new Error(JSON.stringify(data));
        }

        if (this.retryOnRateLimit) {
          return await rateLimitHandler(
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
  };

  /**
   * Deletes a record from the specified table.
   * @method
   * @param {string} table - Table name
   * @param {string} id - Airtable record ID
   * @returns {Promise<DeleteResponse>}
   */
  deleteRecord = async (table: string, id: string): Promise<DeleteResponse> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(id, 'id', 'string', true);
      let url = `${baseURL}/${this.base}/${table}/${id}`;
      const res: Response = await nodeFetch(url, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      const data: DeleteResponse = await res.json();
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
            this.retryTimeout,
            this.maxRetry,
          );
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
   * @returns {Promise<Record[]>}
   */
  bulkCreate = async (table: string, records: Fields[]): Promise<AirtableRecord[]> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(records, 'records', 'object', true);
      let url = `${baseURL}/${this.base}/${table}`;
      const body = records.map((record) => ({
        fields: record,
      }));
      const res: Response = await nodeFetch(url, {
        method: 'post',
        body: JSON.stringify({ records: body }),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      const data: AirtableRecordResponse = await res.json();
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
  };

  /**
   * Updates multiple records on the specified table
   * @method
   * @param {string} table - Table name
   * @param {Array<Record>} records - An array of Record objects
   * @returns {Promise<Record[]>}
   */
  bulkUpdate = async (table: string, records: Fields[]): Promise<AirtableRecord[]> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(records, 'records', 'object', true);
      let url = `${baseURL}/${this.base}/${table}`;
      const body = records.map((record) => {
        const id = record.id;
        const fields: Fields = {};
        Object.keys(record).forEach((key) => {
          if (key !== 'id') fields[key] = record[key];
        });
        return { id, fields };
      });
      const res: Response = await nodeFetch(url, {
        method: 'patch',
        body: JSON.stringify({ records: body }),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      const data: AirtableRecordResponse = await res.json();
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
  };

  /**
   * Deletes multiple records from the specified table
   * @method
   * @param {string} table - Table name
   * @param {Array<string>} ids - Array of Airtable record IDs
   * @returns {Promise<DeleteResponse[]>}
   */
  bulkDelete = async (table: string, ids: string[]): Promise<DeleteResponse[]> => {
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
      const res: Response = await nodeFetch(url, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      const data: AirtableDeletedResponse = await res.json();
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
  };
}
import fetch from './fetch';
import buildOpts from './buildOpts';
import checkError from './checkError';
import checkArg from './checkArg';
import rateLimitHandler from './rateLimitHandler';
const baseURL = 'https://api.airtable.com/v0';

declare global {
  interface Window {
    AsyncAirtable: typeof AsyncAirtable;
  }
}

export interface SelectOptions {
  fields?: string[];
  filterByFormula?: string;
  maxRecords?: number;
  pageSize?: number;
  view?: string;
  sort?: SortObject[];
  offset?: string;
}

export interface Config {
  retryOnRateLimit?: boolean;
  maxRetry?: number;
  retryTimeout?: number;
}

export type ConfigKey = keyof Config;

export interface SortObject {
  field: string;
  direction?: 'asc' | 'desc';
}

export interface DeleteResponse {
  id?: string;
  deleted: boolean;
}

export interface AirtableRecord {
  id: string;
  fields: Fields;
  createdTime?: string;
}

export interface Fields {
  [key: string]: unknown;
}

export interface AirtableRecordResponse {
  records: AirtableRecord[];
  offset?: string;
}

export interface AirtableDeletedResponse {
  records: DeleteResponse[];
}

export interface AirtableUpdateRecord {
  id: string;
  fields: Fields;
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
 * @description The record passed into the createRecord and bulkCreate methods
 * @example
 * {
 *   title: "hello",
 *   description: "world"
 * }
 * @property {object} ...fields - Add a separate property for each field
 */

/**
 * @typedef UpdateRecord
 * @type {Object}
 * @name UpdateRecord
 * @description The record passed into the updateRecord and bulkUpdate methods
 * @example
 * {
 *   id: "recABCDEFGHIJK",
 *   fields: {
 *     title: "hello",
 *     description: "world"
 *   }
 * }
 * @property {string} id - Airtable Record ID (only needed for updates)
 * @property {object} fields - Add a separate property for each field
 */

/**
 * @typedef AirtableRecord
 * @type {Object}
 * @name AirtableRecord
 * @description The record returned by AsyncAirtable
 * @example
 * {
 *   id: "recABCDEFGHIJK",
 *   fields: {
 *     title: "hello",
 *     description: "world"
 *   },
 *   createdTime: 'timestamp'
 * }
 * @property {string} id - Airtable Record ID
 * @property {object} fields - Object of fields in the record
 * @property {string} createdTime - Created timestamp
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
   * @returns {Promise<AirtableRecord[]>}
   */
  select = async (
    table: string,
    options?: SelectOptions,
    page?: number,
  ): Promise<AirtableRecord[]> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(options, 'options', 'object');
      checkArg(page, 'page', 'number');
      const url = `${baseURL}/${this.base}/${table}`;
      const opts: SelectOptions = options ? { ...options } : {};
      Object.keys(opts).forEach((option) => {
        if (!validOptions.includes(option)) {
          throw new Error(`Invalid option: ${option}`);
        }
      });
      let offset: string | undefined = '';
      let data: AirtableRecord[] = [];
      if (page) {
        for (let i = 0; i < page; i++) {
          if (offset) {
            opts.offset = offset;
          }
          try {
            const res: Response = await fetch(`${url}?${buildOpts(opts)}`, {
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
        while (!done) {
          if (offset) {
            opts.offset = offset;
          }
          try {
            const res: Response = await fetch(`${url}?${buildOpts(opts)}`, {
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
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  };

  /**
   * Finds a record on the specified table.
   * @method
   * @param {string} table - Table name
   * @param {string} id - Airtable record ID
   * @returns {Promise<AirtableRecord>}
   */
  find = async (table: string, id: string): Promise<AirtableRecord> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(id, 'id', 'string', true);
      const url = `${baseURL}/${this.base}/${table}/${id}`;
      const res: Response = await fetch(url, {
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
   * @param {Record} record - Record object, used to structure data for insert
   * @returns {Promise<AirtableRecord>}
   */
  createRecord = async (
    table: string,
    record: Fields,
  ): Promise<AirtableRecord> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(record, 'record', 'object', true);
      const url = `${baseURL}/${this.base}/${table}`;
      const body = { fields: record };
      const res: Response = await fetch(url, {
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
   * @param {UpdateRecord} record - Record object, used to update data within a specific record
   * @param {boolean} [destructive=false] - (Dis-)Allow a destructive update
   * @returns {Promise<AirtableRecord>}
   */
  updateRecord = async (
    table: string,
    record: AirtableUpdateRecord,
    destructive = false,
  ): Promise<AirtableRecord> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(record, 'record', 'object', true);
      const url = `${baseURL}/${this.base}/${table}/${record.id}`;
      const { fields } = record;
      const res: Response = await fetch(url, {
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
      const url = `${baseURL}/${this.base}/${table}/${id}`;
      const res: Response = await fetch(url, {
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
   * @returns {Promise<AirtableRecord[]>}
   */
  bulkCreate = async (
    table: string,
    records: Fields[],
  ): Promise<AirtableRecord[]> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(records, 'records', 'object', true);
      const url = `${baseURL}/${this.base}/${table}`;
      const body = records.map((record) => ({
        fields: record,
      }));
      const res: Response = await fetch(url, {
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
   * @param {Array<UpdateRecord>} records - An array of Record objects
   * @returns {Promise<AirtableRecord[]>}
   */
  bulkUpdate = async (
    table: string,
    records: AirtableUpdateRecord[],
  ): Promise<AirtableRecord[]> => {
    try {
      checkArg(table, 'table', 'string', true);
      checkArg(records, 'records', 'object', true);
      const url = `${baseURL}/${this.base}/${table}`;
      const res: Response = await fetch(url, {
        method: 'patch',
        body: JSON.stringify({ records }),
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
              body: JSON.stringify({ records }),
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
  bulkDelete = async (
    table: string,
    ids: string[],
  ): Promise<DeleteResponse[]> => {
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
      const url = `${baseURL}/${this.base}/${table}?${encodeURI(query)}`;
      const res: Response = await fetch(url, {
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

  /**
   * Checks if a record exists, and if it does updates it, if not creates a new record.
   * @method
   * @param {string} table - Table name
   * @param {string} filterString - The filter formula string used to check for a record
   * @param {Record} record - Record object used to either update or create a record
   * @returns {Promise<AirtableRecord>}
   */
  upsertRecord = async (
    table: string,
    filterString: string,
    record: Fields,
  ): Promise<AirtableRecord> => {
    checkArg(table, 'table', 'string', true);
    checkArg(filterString, 'filterString', 'string', true);
    checkArg(record, 'record', 'object', true);
    const exists = await this.select(table, { filterByFormula: filterString });
    if (!exists[0]) {
      return await this.createRecord(table, record);
    } else {
      return await this.updateRecord(table, {
        id: exists[0].id,
        fields: record,
      });
    }
  };
}

if (module) {
  module.exports = AsyncAirtable;
}

if (typeof window !== 'undefined') {
  window.AsyncAirtable = AsyncAirtable;
}

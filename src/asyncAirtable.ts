import fetch from './fetch';
import buildOpts from './buildOpts';
import checkError from './checkError';
import checkArg from './checkArg';
import rateLimitHandler from './rateLimitHandler';
const baseURL = 'https://api.airtable.com/v0';
import {
  SelectOptions,
  AirtableDeletedResponse,
  AirtableRecord,
  AirtableRecordResponse,
  AirtableUpdateRecord,
  DeleteResponse,
  Fields,
  Config,
  queryBody,
  typecast,
  updateOpts,
  bulkQueryBody,
} from './@types';

/** @ignore */
declare global {
  interface Window {
    AsyncAirtable: typeof AsyncAirtable;
  }
}

const validOptions: string[] = [
  'fields',
  'filterByFormula',
  'maxRecords',
  'pageSize',
  'sort',
  'view',
  'where',
];

/**
 * The main AsyncAirtable class.
 */
class AsyncAirtable {
  /**
   * @default=true
   * This decides whether or not the library will
   * handle retrying a request when rate limited
   */
  retryOnRateLimit: boolean;
  /**
   * @default=60000
   * The maxmium amount of time before the
   * library will stop retrying and timeout when rate limited
   */
  maxRetry: number;
  /**
   * @default=5000
   * The starting timeout for the retry. This will get 50%
   * larger with each try until you hit the maxRetry amount
   */
  retryTimeout: number;
  /** The API Key from AirTable */
  apiKey: string;
  /** The base id from AirTable */
  base: string;

  /**
   * Creates a new instance of the AsyncAirtable library.
   * @param apiKey The API Key from AirTable
   * @param base The base id from AirTable
   * @param config The config to use for this instance of AsyncAirtable
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
   * @param table Table name
   * @param options Options object, used to filter records
   * @param page Used to get a specific page of records
   * @returns
   * @async
   */
  select = async (
    table: string,
    options?: SelectOptions,
    page?: number,
  ): Promise<AirtableRecord[]> => {
    try {
      checkArg(table, 'table', 'string');
      checkArg(options, 'options', 'object', false);
      checkArg(page, 'page', 'number', false);
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
   * @param table Table name
   * @param id Airtable record ID
   * @returns
   * @async
   */
  find = async (table: string, id: string): Promise<AirtableRecord> => {
    try {
      checkArg(table, 'table', 'string');
      checkArg(id, 'id', 'string');
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
   * @param table - Table name
   * @param record - Record object, used to structure data for insert
   * @param typecast - Used for allowing the ability to add new selections for Select and Multiselect fields.
   * @returns
   * @async
   */
  createRecord = async (
    table: string,
    record: Fields,
    typecast?: typecast,
  ): Promise<AirtableRecord> => {
    try {
      checkArg(table, 'table', 'string');
      checkArg(record, 'record', 'object');
      checkArg(typecast, 'typecast', 'boolean', false);
      const url = `${baseURL}/${this.base}/${table}`;
      const body: queryBody = { fields: record };
      if (typecast !== undefined) {
        body.typecast = typecast;
      }
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
   * @param table - Table name
   * @param record - Record object, used to update data within a specific record
   * @param opts - An object with options for your update statement
   * @returns
   * @async
   */
  updateRecord = async (
    table: string,
    record: AirtableUpdateRecord,
    opts?: updateOpts,
  ): Promise<AirtableRecord> => {
    try {
      checkArg(table, 'table', 'string');
      checkArg(record, 'record', 'object');
      if (opts) {
        checkArg(opts.destructive, 'opts.desctructive', 'boolean');
        checkArg(opts.typecast, 'opts.typecast', 'boolean', false);
      }
      const url = `${baseURL}/${this.base}/${table}/${record.id}`;
      const body: queryBody = { fields: record.fields };
      if (opts?.typecast !== undefined) {
        body.typecast = opts?.typecast;
      }
      const res: Response = await fetch(url, {
        method: opts?.destructive ? 'put' : 'patch',
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
              method: opts?.destructive ? 'put' : 'patch',
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
   * Deletes a record from the specified table.
   * @param table - Table name
   * @param id - Airtable record ID
   * @returns
   * @async
   */
  deleteRecord = async (table: string, id: string): Promise<DeleteResponse> => {
    try {
      checkArg(table, 'table', 'string');
      checkArg(id, 'id', 'string');
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
   * @param table - Table name
   * @param records - An array of Record objects
   * @param typecast - Used for allowing the ability to add new selections for Select and Multiselect fields.
   * @returns
   * @async
   */
  bulkCreate = async (
    table: string,
    records: Fields[],
    typecast?: typecast,
  ): Promise<AirtableRecord[]> => {
    try {
      checkArg(table, 'table', 'string');
      checkArg(records, 'records', 'array');
      checkArg(typecast, 'typecast', 'boolean', false);
      const url = `${baseURL}/${this.base}/${table}`;
      const body: bulkQueryBody = {
        records: records.map((record) => ({
          fields: record,
        })),
      };
      if (typecast !== undefined) {
        body.typecast = typecast;
      }
      const res: Response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
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
              body: JSON.stringify(body),
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
   * @param table - Table name
   * @param records - An array of Record objects
   * @param opts - An object with options for your update statement
   * @returns
   * @async
   */
  bulkUpdate = async (
    table: string,
    records: AirtableUpdateRecord[],
    opts?: updateOpts,
  ): Promise<AirtableRecord[]> => {
    try {
      checkArg(table, 'table', 'string');
      checkArg(records, 'records', 'array');
      if (opts) {
        checkArg(opts.destructive, 'opts.desctructive', 'boolean', false);
        checkArg(opts.typecast, 'opts.typecast', 'boolean', false);
      }
      const url = `${baseURL}/${this.base}/${table}`;
      const body: bulkQueryBody = { records };
      if (opts?.typecast !== undefined) {
        body.typecast = opts?.typecast;
      }
      const res: Response = await fetch(url, {
        method: opts?.destructive ? 'put' : 'patch',
        body: JSON.stringify(body),
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
              method: opts?.destructive ? 'put' : 'patch',
              body: JSON.stringify(body),
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
   * @param table - Table name
   * @param ids - Array of Airtable record IDs
   * @returns
   * @async
   */
  bulkDelete = async (
    table: string,
    ids: string[],
  ): Promise<DeleteResponse[]> => {
    try {
      checkArg(table, 'table', 'string');
      checkArg(ids, 'ids', 'array');
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
   * @param table - Table name
   * @param filterString - The filter formula string used to check for a record
   * @param record - Record object used to either update or create a record
   * @param opts - An object with options for your update statement
   * @returns
   * @async
   */
  upsertRecord = async (
    table: string,
    filterString: string,
    record: Fields,
    opts?: updateOpts,
  ): Promise<AirtableRecord> => {
    checkArg(table, 'table', 'string');
    checkArg(filterString, 'filterString', 'string');
    checkArg(record, 'record', 'object');
    if (opts) {
      checkArg(opts.destructive, 'opts.desctructive', 'boolean', false);
      checkArg(opts.typecast, 'opts.typecast', 'boolean', false);
    }
    const exists = await this.select(table, { filterByFormula: filterString });
    if (!exists[0]) {
      return await this.createRecord(table, record, opts?.typecast);
    } else {
      return await this.updateRecord(
        table,
        {
          id: exists[0].id,
          fields: record,
        },
        opts,
      );
    }
  };
}

export = AsyncAirtable;

if (typeof window !== 'undefined') {
  window.AsyncAirtable = AsyncAirtable;
}

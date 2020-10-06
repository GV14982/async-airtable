const nodeFetch = require('node-fetch');
const baseURL = 'https://api.airtable.com/v0';

const validOptions = [
  'fields',
  'filterByFormula',
  'maxRecords',
  'pageSize',
  'sort',
  'view',
];

class AsyncAirtable {
  constructor(apiKey, base) {
    if (!apiKey) throw new Error('API Key is required.');
    if (!base) throw new Error('Base ID is required.');
    this.apiKey = apiKey;
    this.base = base;
  }

  buildOpts = (opts) => {
    const params = Object.keys(opts)
      .map((key, i) => {
        const opt = opts[key];
        let formatted;
        if (Array.isArray(opt)) {
          formatted = opt
            .map((item, j) => {
              if (typeof item === 'object') {
                return Object.keys(item)
                  .map((subKey) => {
                    return `${key}[${j}][${subKey}]=${item[subKey]}`;
                  })
                  .join('&');
              } else if (typeof item === 'string') {
                return `${key}[]=${item}`;
              }
            })
            .join('&');
        } else {
          formatted = `${key}=${opt}`;
        }
        return i !== 0 ? `&${formatted}` : formatted;
      })
      .join('');
    return encodeURI(params);
  };

  checkError = (status) => !(status < 300 && status >= 200);

  checkArg = (arg, name, type, required) => {
    if (!arg && required) throw new Error(`Argument "${name}" is required.`);
    if (arg && typeof arg !== type)
      throw new Error(
        `Incorrect data type on argument "${name}". Received "${typeof arg}": expected "${type}"`,
      );
  };

  select = async (table, options, page) => {
    try {
      this.checkArg(table, 'table', 'string', true);
      this.checkArg(options, 'options', 'object');
      this.checkArg(page, 'page', 'number');
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
            const res = await nodeFetch(`${url}?${this.buildOpts(opts)}`, {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            });
            const body = await res.json();
            if (this.checkError(res.status)) {
              throw new Error(JSON.stringify(body));
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
            const res = await nodeFetch(`${url}?${this.buildOpts(opts)}`, {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            });
            const body = await res.json();
            if (this.checkError(res.status)) {
              throw new Error(JSON.stringify(body));
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

  find = async (table, id) => {
    try {
      this.checkArg(table, 'table', 'string', true);
      this.checkArg(id, 'id', 'string', true);
      let url = `${baseURL}/${this.base}/${table}/${id}`;
      const res = await nodeFetch(url, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      const data = await res.json();
      if (this.checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  };

  create = async (table, record) => {
    try {
      this.checkArg(table, 'table', 'string', true);
      this.checkArg(record, 'record', 'object', true);
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
      if (this.checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  };

  update = async (table, record) => {
    try {
      this.checkArg(table, 'table', 'string', true);
      this.checkArg(record, 'record', 'object', true);
      let url = `${baseURL}/${this.base}/${table}/${record.id}`;
      const fields = {};
      Object.keys(record).forEach((key) => {
        if (key !== 'id') fields[key] = record[key];
      });
      const res = await nodeFetch(url, {
        method: 'patch',
        body: JSON.stringify({ fields }),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (this.checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  };

  delete = async (table, id) => {
    try {
      this.checkArg(table, 'table', 'string', true);
      this.checkArg(id, 'id', 'string', true);
      let url = `${baseURL}/${this.base}/${table}/${id}`;
      const res = await nodeFetch(url, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      const data = await res.json();
      if (this.checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  };

  bulkCreate = async (table, records) => {
    try {
      this.checkArg(table, 'table', 'string', true);
      this.checkArg(records, 'records', 'object', true);
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
      if (this.checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data.records;
    } catch (err) {
      throw new Error(err);
    }
  };

  bulkUpdate = async (table, records) => {
    try {
      this.checkArg(table, 'table', 'string', true);
      this.checkArg(records, 'records', 'object', true);
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
      if (this.checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data.records;
    } catch (err) {
      throw new Error(err);
    }
  };

  bulkDelete = async (table, ids) => {
    try {
      this.checkArg(table, 'table', 'string', true);
      this.checkArg(ids, 'ids', 'object', true);
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
      if (this.checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data.records;
    } catch (err) {
      throw new Error(err);
    }
  };
}

module.exports = AsyncAirtable;

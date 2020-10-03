const nodeFetch = require('node-fetch');
baseURL = 'https://api.airtable.com/v0';

module.exports = (apiKey, base) => {
  key = apiKey;
  base = base;
  buildOpts = (opts) => {
    return encodeURI(
      Object.keys(opts)
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
                    .join(i !== 0 || j !== 0 ? '&' : '');
                }
              })
              .join('');
          } else {
            formatted = `${key}=${opt}`;
          }
          return i !== 0 ? `&${formatted}` : formatted;
        })
        .join('')
    );
  };
  checkError = (status) => !(status < 300 && status >= 200);

  this.select = async (table, options, page) => {
    let url = `${baseURL}/${base}/${table}`;
    const opts = options ? { ...options } : {};
    let offset;
    if (page) {
      for (let i = 0; i < page; i++) {
        if (offset) {
          opts.offset = offset;
        }
        try {
          const res = await nodeFetch(`${url}?${buildOpts(opts)}`, {
            headers: { Authorization: `Bearer ${key}` },
          });
          const body = await res.json();
          if (checkError(res.status)) {
            throw new Error(JSON.stringify(body));
          }
          if (i + 1 === page) {
            return body.records;
          }
          offset = body.offset;
        } catch (err) {
          console.error(err);
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
            headers: { Authorization: `Bearer ${key}` },
          });
          const body = await res.json();
          if (checkError(res.status)) {
            throw new Error(JSON.stringify(body));
          }
          data = data.concat(body.records);
          offset = body.offset;
          if (!body.offset) {
            done = true;
          }
        } catch (err) {
          console.error(err);
          throw new Error(err);
        }
      }
      return data;
    }
  };

  this.find = async (table, id) => {
    let url = `${baseURL}/${base}/${table}/${id}`;
    try {
      const res = await nodeFetch(url, {
        headers: { Authorization: `Bearer ${key}` },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  };

  this.bulkCreate = async (table, records) => {
    let url = `${baseURL}/${base}/${table}`;
    const body = records.map((record) => ({
      fields: record,
    }));
    try {
      const res = await nodeFetch(url, {
        method: 'post',
        body: JSON.stringify({ records: body }),
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  };

  this.bulkUpdate = async (table, records) => {
    let url = `${baseURL}/${base}/${table}`;
    const body = records.map((record) => {
      const id = record.id;
      const fields = {};
      Object.keys(record).forEach((key) => {
        if (key !== 'id') fields[key] = record[key];
      });
      return { id, fields };
    });
    try {
      const res = await nodeFetch(url, {
        method: 'patch',
        body: JSON.stringify({ records: body }),
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  };

  this.bulkDelete = async (table, ids) => {
    let query = '';
    ids.forEach((id, i) => {
      if (i !== 0) {
        query = `${query}&records[]=${id}`;
      } else {
        query = `records[]=${id}`;
      }
    });
    let url = `${baseURL}/${base}/${table}?${encodeURI(query)}`;
    try {
      const res = await nodeFetch(url, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  };

  this.create = async (table, record) => {
    let url = `${baseURL}/${base}/${table}`;
    const body = { fields: record };
    try {
      const res = await nodeFetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  };

  this.update = async (table, record) => {
    let url = `${baseURL}/${base}/${table}/${record.id}`;
    const fields = {};
    Object.keys(record).forEach((key) => {
      if (key !== 'id') fields[key] = record[key];
    });
    try {
      const res = await nodeFetch(url, {
        method: 'patch',
        body: JSON.stringify({ fields }),
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  };

  this.delete = async (table, id) => {
    let url = `${baseURL}/${base}/${table}?${id}`;
    try {
      const res = await nodeFetch(url, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });
      const data = await res.json();
      if (checkError(res.status)) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  };

  return this;
};

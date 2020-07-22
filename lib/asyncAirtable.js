const Airtable = require('airtable');

module.exports = asyncAirtable = (apiKey, base, options) => {
  connection = new Airtable({...options, apiKey}).base(base);
  
  this.select = (table, opts, page) => {
    return new Promise((resolve, reject) => {
      const {pageSize} = opts;
      let data = [];
      connection(table).select(opts).eachPage((records, next) => {
        data = [...data, records];
        next();
      }, (err) => {
        if (err) return reject(err);
        data = data[0];
        if (!page) return resolve(data);
        const start = (page - 1) * (pageSize);
        const end = page * (pageSize);
        length = data.length;
        return resolve(data.slice(start, end > length  ? length : end));
      })
    });
  };
  
  this.find = (table, id) => {
    return new Promise((resolve, reject) => {
      connection(table).find(id, (err, record) => {
        if (err) return reject(err)
        return resolve(record);
      })
    });
  };
  
  this.create = (table, records) => {
    return new Promise((resolve, reject) => {
      connection(table).create(records, (err, records) => {
        if (err) return reject(err)
        return resolve(records);
      })
    });
  };
  
  this.update = (table, records) => {
    return new Promise((resolve, reject) => {
      connection(table).update(records, (err, records) => {
        if (err) return reject(err)
        return resolve(records);
      })
    });
  };
  
  this.delete = (table, ids) => {
    return new Promise((resolve, reject) => {
      connection(table).destroy(ids, (err, records) => {
        if (err) return reject(err)
        return resolve(records);
      })
    });
  };

  return this;
} 

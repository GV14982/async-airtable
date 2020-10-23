const nodeFetch = require('node-fetch');

module.exports = async (url, opts, key) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const res = await nodeFetch(url, opts);
        const data = await res.json();
        if (key) {
          resolve(data[key]);
        } else {
          resolve(data);
        }
      } catch (err) {
        reject(err);
      }
    }, 30000);
  });
};

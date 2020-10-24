const nodeFetch = require('node-fetch');

module.exports = async (url, opts, retryTimeout, maxRetry, key) => {
  return new Promise((resolve, reject) => {
    const retryRateLimit = (url, opts, retryTimeout, maxRetry, key) => {
      if (maxRetry < 1) {
        reject('Max timeout exceeded');
      }
      setTimeout(async () => {
        try {
          const res = await nodeFetch(url, opts);
          const data = await res.json();
          if (res.status === 429) {
            return retryRateLimit(
              url,
              opts,
              retryTimeout * 1.5,
              maxRetry - retryTimeout,
              key,
            );
          }
          if (key) {
            resolve(data[key]);
          } else {
            resolve(data);
          }
        } catch (err) {
          reject(err);
        }
      }, retryTimeout);
    };

    retryRateLimit(url, opts, retryTimeout, maxRetry, key);
  });
};

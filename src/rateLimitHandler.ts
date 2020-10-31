import nodeFetch, { RequestInit } from 'node-fetch';
import { AirtableRecord, DeleteResponse } from './asyncAirtable';

export default async (
  url: string,
  opts: RequestInit,
  retryTimeout: number,
  maxRetry: number,
  key?: string,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const retryRateLimit = (
      url: string,
      opts: RequestInit,
      retryTimeout: number,
      maxRetry: number,
      key?: string,
    ): void => {
      if (maxRetry && maxRetry < 1) {
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

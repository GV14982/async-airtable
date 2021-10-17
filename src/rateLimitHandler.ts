import fetch from './fetch';
export default async (
  url: string,
  opts: RequestInit,
  retryTimeout: number,
  maxRetry: number,
  key?: string,
  /** @todo Find a better type than any for this */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          const res = await fetch(url, opts);
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
          resolve(data);
        } catch (err) {
          reject(err);
        }
      }, retryTimeout);
    };

    retryRateLimit(url, opts, retryTimeout, maxRetry, key);
  });
};

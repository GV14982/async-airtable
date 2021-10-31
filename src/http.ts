import { AsyncAirtable } from './asyncAirtable';
import checkError from './checkError';
import fetch from './fetch';
import rateLimitHandler from './rateLimitHandler';

type Args = {
  endpoint: string;
  options?: RequestInit;
  instance: AsyncAirtable;
  pageHandler?: {
    index: number;
    page: number;
  };
};

export const request = async <T>({
  endpoint,
  options,
  instance,
  pageHandler,
}: Args): Promise<T> => {
  try {
    const res: Response = await fetch(endpoint, options);
    const body = await res.json();
    if (checkError(res.status)) {
      if (res.status !== 429) {
        throw new Error(JSON.stringify(body));
      }

      if (instance.retryOnRateLimit) {
        if (!pageHandler || pageHandler.index + 1 === pageHandler.page) {
          const limit = await rateLimitHandler<T>(
            endpoint,
            options ?? {},
            instance.retryTimeout,
            instance.maxRetry,
          );
          return limit;
        }
      }
    }
    return body;
  } catch (err) {
    throw new Error(err);
  }
};

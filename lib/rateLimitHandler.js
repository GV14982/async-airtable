'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const node_fetch_1 = require('node-fetch');
require('@types/node-fetch');
exports.default = (url, opts, retryTimeout, maxRetry, key) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      const retryRateLimit = (url, opts, retryTimeout, maxRetry, key) => {
        if (maxRetry && maxRetry < 1) {
          reject('Max timeout exceeded');
        }
        setTimeout(
          () =>
            __awaiter(void 0, void 0, void 0, function* () {
              try {
                const res = yield node_fetch_1.default(url, opts);
                const data = yield res.json();
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
            }),
          retryTimeout,
        );
      };
      retryRateLimit(url, opts, retryTimeout, maxRetry, key);
    });
  });

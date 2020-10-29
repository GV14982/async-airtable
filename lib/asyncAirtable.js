'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
var node_fetch_1 = require('node-fetch');
var buildOpts_1 = require('./buildOpts');
var checkError_1 = require('./checkError');
var checkArg_1 = require('./checkArg');
var rateLimitHandler_1 = require('./rateLimitHandler');
var baseURL = 'https://api.airtable.com/v0';
var validOptions = [
  'fields',
  'filterByFormula',
  'maxRecords',
  'pageSize',
  'sort',
  'view',
];
var AsyncAirtable = (function () {
  function AsyncAirtable(apiKey, base, config) {
    var _this = this;
    this.select = function (table, options, page) {
      return __awaiter(_this, void 0, void 0, function () {
        var url,
          opts,
          offset,
          i,
          res,
          body,
          err_1,
          done,
          data,
          res,
          body,
          err_2,
          err_3;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 21, , 22]);
              checkArg_1['default'](table, 'table', 'string', true);
              checkArg_1['default'](options, 'options', 'object');
              checkArg_1['default'](page, 'page', 'number');
              url = baseURL + '/' + this.base + '/' + table;
              opts = options ? __assign({}, options) : {};
              Object.keys(opts).forEach(function (option) {
                if (!validOptions.includes(option)) {
                  throw new Error('Invalid option: ' + option);
                }
              });
              offset = '';
              if (!page) return [3, 10];
              i = 0;
              _a.label = 1;
            case 1:
              if (!(i < page)) return [3, 9];
              if (offset) {
                opts.offset = offset;
              }
              _a.label = 2;
            case 2:
              _a.trys.push([2, 7, , 8]);
              return [
                4,
                node_fetch_1['default'](
                  url + '?' + buildOpts_1['default'](opts),
                  {
                    headers: { Authorization: 'Bearer ' + this.apiKey },
                  },
                ),
              ];
            case 3:
              res = _a.sent();
              return [4, res.json()];
            case 4:
              body = _a.sent();
              if (!checkError_1['default'](res.status)) return [3, 6];
              if (res.status !== 429) {
                throw new Error(JSON.stringify(body));
              }
              if (!this.retryOnRateLimit) return [3, 6];
              if (!(i + 1 === page)) return [3, 6];
              return [
                4,
                rateLimitHandler_1['default'](
                  url + '?' + buildOpts_1['default'](opts),
                  {
                    headers: { Authorization: 'Bearer ' + this.apiKey },
                  },
                  this.retryTimeout,
                  this.maxRetry,
                  'records',
                ),
              ];
            case 5:
              return [2, _a.sent()];
            case 6:
              if (i + 1 === page) {
                return [2, body.records];
              }
              offset = body.offset;
              return [3, 8];
            case 7:
              err_1 = _a.sent();
              throw new Error(err_1);
            case 8:
              i++;
              return [3, 1];
            case 9:
              return [3, 20];
            case 10:
              done = false;
              data = [];
              _a.label = 11;
            case 11:
              if (!!done) return [3, 19];
              if (offset) {
                opts.offset = offset;
              }
              _a.label = 12;
            case 12:
              _a.trys.push([12, 17, , 18]);
              return [
                4,
                node_fetch_1['default'](
                  url + '?' + buildOpts_1['default'](opts),
                  {
                    headers: { Authorization: 'Bearer ' + this.apiKey },
                  },
                ),
              ];
            case 13:
              res = _a.sent();
              return [4, res.json()];
            case 14:
              body = _a.sent();
              if (!checkError_1['default'](res.status)) return [3, 16];
              if (res.status !== 429) {
                throw new Error(JSON.stringify(body));
              }
              if (!this.retryOnRateLimit) return [3, 16];
              return [
                4,
                rateLimitHandler_1['default'](
                  url + '?' + buildOpts_1['default'](opts),
                  {
                    headers: { Authorization: 'Bearer ' + this.apiKey },
                  },
                  this.retryTimeout,
                  this.maxRetry,
                  'records',
                ),
              ];
            case 15:
              return [2, _a.sent()];
            case 16:
              data = data.concat(body.records);
              offset = body.offset;
              if (!body.offset) {
                done = true;
              }
              return [3, 18];
            case 17:
              err_2 = _a.sent();
              throw new Error(err_2);
            case 18:
              return [3, 11];
            case 19:
              return [2, data];
            case 20:
              return [3, 22];
            case 21:
              err_3 = _a.sent();
              throw new Error(err_3);
            case 22:
              return [2];
          }
        });
      });
    };
    this.find = function (table, id) {
      return __awaiter(_this, void 0, void 0, function () {
        var url, res, data, err_4;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 5, , 6]);
              checkArg_1['default'](table, 'table', 'string', true);
              checkArg_1['default'](id, 'id', 'string', true);
              url = baseURL + '/' + this.base + '/' + table + '/' + id;
              return [
                4,
                node_fetch_1['default'](url, {
                  headers: { Authorization: 'Bearer ' + this.apiKey },
                }),
              ];
            case 1:
              res = _a.sent();
              return [4, res.json()];
            case 2:
              data = _a.sent();
              if (!checkError_1['default'](res.status)) return [3, 4];
              if (res.status !== 429) {
                throw new Error(JSON.stringify(data));
              }
              if (!this.retryOnRateLimit) return [3, 4];
              return [
                4,
                rateLimitHandler_1['default'](
                  url,
                  {
                    headers: { Authorization: 'Bearer ' + this.apiKey },
                  },
                  this.retryTimeout,
                  this.maxRetry,
                ),
              ];
            case 3:
              return [2, _a.sent()];
            case 4:
              return [2, data];
            case 5:
              err_4 = _a.sent();
              throw new Error(err_4);
            case 6:
              return [2];
          }
        });
      });
    };
    this.createRecord = function (table, record) {
      return __awaiter(_this, void 0, void 0, function () {
        var url, body, res, data, err_5;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 5, , 6]);
              checkArg_1['default'](table, 'table', 'string', true);
              checkArg_1['default'](record, 'record', 'object', true);
              url = baseURL + '/' + this.base + '/' + table;
              body = { fields: record };
              return [
                4,
                node_fetch_1['default'](url, {
                  method: 'post',
                  body: JSON.stringify(body),
                  headers: {
                    Authorization: 'Bearer ' + this.apiKey,
                    'Content-Type': 'application/json',
                  },
                }),
              ];
            case 1:
              res = _a.sent();
              return [4, res.json()];
            case 2:
              data = _a.sent();
              if (!checkError_1['default'](res.status)) return [3, 4];
              if (res.status !== 429) {
                throw new Error(JSON.stringify(data));
              }
              if (!this.retryOnRateLimit) return [3, 4];
              return [
                4,
                rateLimitHandler_1['default'](
                  url,
                  {
                    method: 'post',
                    body: JSON.stringify(body),
                    headers: {
                      Authorization: 'Bearer ' + this.apiKey,
                      'Content-Type': 'application/json',
                    },
                  },
                  this.retryTimeout,
                  this.maxRetry,
                ),
              ];
            case 3:
              return [2, _a.sent()];
            case 4:
              return [2, data];
            case 5:
              err_5 = _a.sent();
              throw new Error(err_5);
            case 6:
              return [2];
          }
        });
      });
    };
    this.updateRecord = function (table, record, destructive) {
      if (destructive === void 0) {
        destructive = false;
      }
      return __awaiter(_this, void 0, void 0, function () {
        var url, fields_1, res, data, err_6;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 5, , 6]);
              checkArg_1['default'](table, 'table', 'string', true);
              checkArg_1['default'](record, 'record', 'object', true);
              url = baseURL + '/' + this.base + '/' + table + '/' + record.id;
              fields_1 = {};
              Object.keys(record).forEach(function (key) {
                if (key !== 'id') fields_1[key] = record[key];
              });
              return [
                4,
                node_fetch_1['default'](url, {
                  method: destructive ? 'put' : 'patch',
                  body: JSON.stringify({ fields: fields_1 }),
                  headers: {
                    Authorization: 'Bearer ' + this.apiKey,
                    'Content-Type': 'application/json',
                  },
                }),
              ];
            case 1:
              res = _a.sent();
              return [4, res.json()];
            case 2:
              data = _a.sent();
              if (!checkError_1['default'](res.status)) return [3, 4];
              if (res.status !== 429) {
                throw new Error(JSON.stringify(data));
              }
              if (!this.retryOnRateLimit) return [3, 4];
              return [
                4,
                rateLimitHandler_1['default'](
                  url,
                  {
                    method: destructive ? 'put' : 'patch',
                    body: JSON.stringify({ fields: fields_1 }),
                    headers: {
                      Authorization: 'Bearer ' + this.apiKey,
                      'Content-Type': 'application/json',
                    },
                  },
                  this.retryTimeout,
                  this.maxRetry,
                ),
              ];
            case 3:
              return [2, _a.sent()];
            case 4:
              return [2, data];
            case 5:
              err_6 = _a.sent();
              throw new Error(err_6);
            case 6:
              return [2];
          }
        });
      });
    };
    this.deleteRecord = function (table, id) {
      return __awaiter(_this, void 0, void 0, function () {
        var url, res, data, err_7;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 5, , 6]);
              checkArg_1['default'](table, 'table', 'string', true);
              checkArg_1['default'](id, 'id', 'string', true);
              url = baseURL + '/' + this.base + '/' + table + '/' + id;
              return [
                4,
                node_fetch_1['default'](url, {
                  method: 'delete',
                  headers: {
                    Authorization: 'Bearer ' + this.apiKey,
                  },
                }),
              ];
            case 1:
              res = _a.sent();
              return [4, res.json()];
            case 2:
              data = _a.sent();
              if (!checkError_1['default'](res.status)) return [3, 4];
              if (res.status !== 429) {
                throw new Error(JSON.stringify(data));
              }
              if (!this.retryOnRateLimit) return [3, 4];
              return [
                4,
                rateLimitHandler_1['default'](
                  url,
                  {
                    method: 'delete',
                    headers: {
                      Authorization: 'Bearer ' + this.apiKey,
                    },
                  },
                  this.retryTimeout,
                  this.maxRetry,
                ),
              ];
            case 3:
              return [2, _a.sent()];
            case 4:
              return [2, data];
            case 5:
              err_7 = _a.sent();
              throw new Error(err_7);
            case 6:
              return [2];
          }
        });
      });
    };
    this.bulkCreate = function (table, records) {
      return __awaiter(_this, void 0, void 0, function () {
        var url, body, res, data, err_8;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 5, , 6]);
              checkArg_1['default'](table, 'table', 'string', true);
              checkArg_1['default'](records, 'records', 'object', true);
              url = baseURL + '/' + this.base + '/' + table;
              body = records.map(function (record) {
                return {
                  fields: record,
                };
              });
              return [
                4,
                node_fetch_1['default'](url, {
                  method: 'post',
                  body: JSON.stringify({ records: body }),
                  headers: {
                    Authorization: 'Bearer ' + this.apiKey,
                    'Content-Type': 'application/json',
                  },
                }),
              ];
            case 1:
              res = _a.sent();
              return [4, res.json()];
            case 2:
              data = _a.sent();
              if (!checkError_1['default'](res.status)) return [3, 4];
              if (res.status !== 429) {
                throw new Error(JSON.stringify(data));
              }
              if (!this.retryOnRateLimit) return [3, 4];
              return [
                4,
                rateLimitHandler_1['default'](
                  url,
                  {
                    method: 'post',
                    body: JSON.stringify({ records: body }),
                    headers: {
                      Authorization: 'Bearer ' + this.apiKey,
                      'Content-Type': 'application/json',
                    },
                  },
                  this.retryTimeout,
                  this.maxRetry,
                  'records',
                ),
              ];
            case 3:
              return [2, _a.sent()];
            case 4:
              return [2, data.records];
            case 5:
              err_8 = _a.sent();
              throw new Error(err_8);
            case 6:
              return [2];
          }
        });
      });
    };
    this.bulkUpdate = function (table, records) {
      return __awaiter(_this, void 0, void 0, function () {
        var url, body, res, data, err_9;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 5, , 6]);
              checkArg_1['default'](table, 'table', 'string', true);
              checkArg_1['default'](records, 'records', 'object', true);
              url = baseURL + '/' + this.base + '/' + table;
              body = records.map(function (record) {
                var id = record.id;
                var fields = {};
                Object.keys(record).forEach(function (key) {
                  if (key !== 'id') fields[key] = record[key];
                });
                return { id: id, fields: fields };
              });
              return [
                4,
                node_fetch_1['default'](url, {
                  method: 'patch',
                  body: JSON.stringify({ records: body }),
                  headers: {
                    Authorization: 'Bearer ' + this.apiKey,
                    'Content-Type': 'application/json',
                  },
                }),
              ];
            case 1:
              res = _a.sent();
              return [4, res.json()];
            case 2:
              data = _a.sent();
              if (!checkError_1['default'](res.status)) return [3, 4];
              if (res.status !== 429) {
                throw new Error(JSON.stringify(data));
              }
              if (!this.retryOnRateLimit) return [3, 4];
              return [
                4,
                rateLimitHandler_1['default'](
                  url,
                  {
                    method: 'patch',
                    body: JSON.stringify({ records: body }),
                    headers: {
                      Authorization: 'Bearer ' + this.apiKey,
                      'Content-Type': 'application/json',
                    },
                  },
                  this.retryTimeout,
                  this.maxRetry,
                  'records',
                ),
              ];
            case 3:
              return [2, _a.sent()];
            case 4:
              return [2, data.records];
            case 5:
              err_9 = _a.sent();
              throw new Error(err_9);
            case 6:
              return [2];
          }
        });
      });
    };
    this.bulkDelete = function (table, ids) {
      return __awaiter(_this, void 0, void 0, function () {
        var query_1, url, res, data, err_10;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 5, , 6]);
              checkArg_1['default'](table, 'table', 'string', true);
              checkArg_1['default'](ids, 'ids', 'object', true);
              query_1 = '';
              ids.forEach(function (id, i) {
                if (i !== 0) {
                  query_1 = query_1 + '&records[]=' + id;
                } else {
                  query_1 = 'records[]=' + id;
                }
              });
              url =
                baseURL +
                '/' +
                this.base +
                '/' +
                table +
                '?' +
                encodeURI(query_1);
              return [
                4,
                node_fetch_1['default'](url, {
                  method: 'delete',
                  headers: {
                    Authorization: 'Bearer ' + this.apiKey,
                  },
                }),
              ];
            case 1:
              res = _a.sent();
              return [4, res.json()];
            case 2:
              data = _a.sent();
              if (!checkError_1['default'](res.status)) return [3, 4];
              if (res.status !== 429) {
                throw new Error(JSON.stringify(data));
              }
              if (!this.retryOnRateLimit) return [3, 4];
              return [
                4,
                rateLimitHandler_1['default'](
                  url,
                  {
                    method: 'delete',
                    headers: {
                      Authorization: 'Bearer ' + this.apiKey,
                    },
                  },
                  this.retryTimeout,
                  this.maxRetry,
                  'records',
                ),
              ];
            case 3:
              return [2, _a.sent()];
            case 4:
              return [2, data.records];
            case 5:
              err_10 = _a.sent();
              throw new Error(err_10);
            case 6:
              return [2];
          }
        });
      });
    };
    if (!apiKey) throw new Error('API Key is required.');
    if (!base) throw new Error('Base ID is required.');
    this.apiKey = apiKey;
    this.base = base;
    this.retryOnRateLimit =
      (config === null || config === void 0
        ? void 0
        : config.retryOnRateLimit) || true;
    this.retryTimeout =
      (config === null || config === void 0 ? void 0 : config.retryTimeout) ||
      5000;
    this.maxRetry =
      (config === null || config === void 0 ? void 0 : config.maxRetry) ||
      60000;
  }
  return AsyncAirtable;
})();
exports['default'] = AsyncAirtable;
//# sourceMappingURL=asyncAirtable.js.map

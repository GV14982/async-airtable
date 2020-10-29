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
    this.retryOnRateLimit = true;
    this.maxRetry = 60000;
    this.retryTimeout = 5000;
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
              offset = void 0;
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
                  node_fetch_1['default'],
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
                  node_fetch_1['default'],
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
                  node_fetch_1['default'],
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
                  node_fetch_1['default'],
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
                  node_fetch_1['default'],
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
                  node_fetch_1['default'],
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
                  node_fetch_1['default'],
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
                  node_fetch_1['default'],
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
                  node_fetch_1['default'],
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
    if (config) {
      Object.keys(config).forEach(function (key) {
        _this[key] = config[key];
      });
    }
  }
  return AsyncAirtable;
})();
exports['default'] = AsyncAirtable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmNBaXJ0YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hc3luY0FpcnRhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBK0M7QUFDL0MseUNBQW9DO0FBQ3BDLDJDQUFzQztBQUN0Qyx1Q0FBa0M7QUFDbEMsdURBQWtEO0FBRWxELElBQU0sT0FBTyxHQUFHLDZCQUE2QixDQUFDO0FBbUU5QyxJQUFNLFlBQVksR0FBYTtJQUM3QixRQUFRO0lBQ1IsaUJBQWlCO0lBQ2pCLFlBQVk7SUFDWixVQUFVO0lBQ1YsTUFBTTtJQUNOLE1BQU07Q0FDUCxDQUFDO0FBb0NGO0lBY0UsdUJBQVksTUFBYyxFQUFFLElBQVksRUFBRSxNQUFlO1FBQXpELGlCQVVDO1FBdkJELHFCQUFnQixHQUFZLElBQUksQ0FBQztRQUNqQyxhQUFRLEdBQVcsS0FBSyxDQUFDO1FBQ3pCLGlCQUFZLEdBQVcsSUFBSSxDQUFDO1FBK0I1QixXQUFNLEdBQUcsVUFBTyxLQUFhLEVBQUUsT0FBdUIsRUFBRSxJQUFhOzs7Ozs7d0JBRWpFLHFCQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3pDLHFCQUFRLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDdkMscUJBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUM3QixHQUFHLEdBQU0sT0FBTyxTQUFJLElBQUksQ0FBQyxJQUFJLFNBQUksS0FBTyxDQUFDO3dCQUN2QyxJQUFJLEdBQWtCLE9BQU8sQ0FBQyxDQUFDLGNBQU0sT0FBTyxFQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7d0JBQzFELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFB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

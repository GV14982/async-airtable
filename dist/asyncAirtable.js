/******/ (() => {
  // webpackBootstrap
  /******/ 'use strict';
  /******/ var __webpack_modules__ = {
    /***/ 132: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) {
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
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
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
      Object.defineProperty(exports, '__esModule', { value: true });
      var fetch_1 = __webpack_require__(480);
      var buildOpts_1 = __webpack_require__(934);
      var checkError_1 = __webpack_require__(365);
      var checkArg_1 = __webpack_require__(202);
      var rateLimitHandler_1 = __webpack_require__(595);
      var baseURL = 'https://api.airtable.com/v0';
      /**
       * @typedef Options
       * @type {Object}
       * @description An object of possible options. This object cannot be initialized, it is for reference only.
       * @property {string[]} [fields] - An array of specific field names to be returned. Returns all fields if none are supplied.
       * @property {string} [filterByFormula] - A [formula used](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) to filter the records
       * @property {number} [maxRecords=100] - The maximum total number of records that will be returned in your requests. Should be smaller than or equal to `pageSize`.
       * @property {number} [pageSize=100] - The number of records returned in each request. Must be less than or equal to 100.
       * @property {SortOption[]} [sort] - A list of sort objects that specifies how the records will be ordered.
       * @property {string} [view] -
       * The name or id of a view on the specified table.
       * If set, only the records in that view will be returned.
       * The records will be sorted according to the order
       * of the view unless the sort parameter is included,
       * which overrides that order. Fields hidden in this view
       * will be returned in the results. To only return
       * a subset of fields, use the fields parameter.
       * @example
       * * {
       *    fields: ['name', 'email', 'date'],
       *    filterByFormula: "{name} = 'Paul'",
       *    maxRecords: 50,
       *    pageSize: 10,
       *    sort: [
       *      {
       *        field: "name",
       *        direction: "desc"
       *      },
       *      {
       *        field: "date",
       *        direction: "asc"
       *      }
       *    ],
       *    view: 'Grid view'
       * }
       */
      /**
       * @typedef SortOption
       * @type {Object}
       * @property {string} field - The field name you want to sort by
       * @property {string} [direction='asc'] - The direction of the sort
       * @example
       * {
       *    field: "name",
       *    direction: "desc"
       * }
       */
      /**
       * @typedef DeleteResponse
       * @type {Object}
       * @property {string} [id] - ID of the deleted record
       * @property {boolean} deleted - Status if a record was deleted
       */
      var validOptions = [
        'fields',
        'filterByFormula',
        'maxRecords',
        'pageSize',
        'sort',
        'view',
      ];
      /**
       * @typedef Record
       * @type {Object}
       * @name Record
       * @description The record passed into the createRecord and bulkCreate methods
       * @example
       * {
       *   title: "hello",
       *   description: "world"
       * }
       * @property {object} ...fields - Add a separate property for each field
       */
      /**
       * @typedef UpdateRecord
       * @type {Object}
       * @name UpdateRecord
       * @description The record passed into the updateRecord and bulkUpdate methods
       * @example
       * {
       *   id: "recABCDEFGHIJK",
       *   fields: {
       *     title: "hello",
       *     description: "world"
       *   }
       * }
       * @property {string} id - Airtable Record ID (only needed for updates)
       * @property {object} fields - Add a separate property for each field
       */
      /**
       * @typedef AirtableRecord
       * @type {Object}
       * @name AirtableRecord
       * @description The record returned by AsyncAirtable
       * @example
       * {
       *   id: "recABCDEFGHIJK",
       *   fields: {
       *     title: "hello",
       *     description: "world"
       *   },
       *   createdTime: 'timestamp'
       * }
       * @property {string} id - Airtable Record ID
       * @property {object} fields - Object of fields in the record
       * @property {string} createdTime - Created timestamp
       */
      /**
       * @typedef Config
       * @type {Object}
       * @description An optional object used to instatiate AsyncAirtable
       * @example
       * {
       *    "retryOnRateLimit": true,
       *    "maxRetry": 60000,
       *    "retryTimeout": 5000
       * }
       * @property {boolean} [retryOnRateLimit=true] - This decides whether or not the library will handle retrying a request when rate limited
       * @property {number} [maxRetry=60000] - The maxmium amount of time before the library will stop retrying and timeout when rate limited
       * @property {number} [maxRetry=5000] - The starting timeout for the retry. This will get 50% larger with each try until you hit the maxRetry amount
       */
      /**
       * The main AsyncAirtable Library
       * @class
       */
      var AsyncAirtable = /** @class */ (function () {
        /**
         * Creates a new instance of the AsyncAirtable library.
         * @constructor
         * @param {string} apiKey - The API Key from AirTable
         * @param {string} base - The base id from AirTable
         * @param {Config} config - The config to use for this instance of AsyncAirtable
         */
        function AsyncAirtable(apiKey, base, config) {
          var _this = this;
          /**
           * Select record(s) from the specified table.
           * @method
           * @param {string} table - Table name
           * @param {Options} [options] - Options object, used to filter records
           * @param {number} [page] - Used to get a specific page of records
           * @returns {Promise<AirtableRecord[]>}
           */
          this.select = function (table, options, page) {
            return __awaiter(_this, void 0, void 0, function () {
              var url,
                opts,
                offset,
                data,
                i,
                res,
                body,
                err_1,
                done,
                res,
                body,
                err_2,
                err_3;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    _a.trys.push([0, 20, , 21]);
                    checkArg_1.default(table, 'table', 'string', true);
                    checkArg_1.default(options, 'options', 'object');
                    checkArg_1.default(page, 'page', 'number');
                    url = baseURL + '/' + this.base + '/' + table;
                    opts = options ? __assign({}, options) : {};
                    Object.keys(opts).forEach(function (option) {
                      if (!validOptions.includes(option)) {
                        throw new Error('Invalid option: ' + option);
                      }
                    });
                    offset = '';
                    data = [];
                    if (!page) return [3 /*break*/, 10];
                    i = 0;
                    _a.label = 1;
                  case 1:
                    if (!(i < page)) return [3 /*break*/, 9];
                    if (offset) {
                      opts.offset = offset;
                    }
                    _a.label = 2;
                  case 2:
                    _a.trys.push([2, 7, , 8]);
                    return [
                      4 /*yield*/,
                      fetch_1.default(url + '?' + buildOpts_1.default(opts), {
                        headers: { Authorization: 'Bearer ' + this.apiKey },
                      }),
                    ];
                  case 3:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                  case 4:
                    body = _a.sent();
                    if (!checkError_1.default(res.status))
                      return [3 /*break*/, 6];
                    if (res.status !== 429) {
                      throw new Error(JSON.stringify(body));
                    }
                    if (!this.retryOnRateLimit) return [3 /*break*/, 6];
                    if (!(i + 1 === page)) return [3 /*break*/, 6];
                    return [
                      4 /*yield*/,
                      rateLimitHandler_1.default(
                        url + '?' + buildOpts_1.default(opts),
                        {
                          headers: { Authorization: 'Bearer ' + this.apiKey },
                        },
                        this.retryTimeout,
                        this.maxRetry,
                        'records',
                      ),
                    ];
                  case 5:
                    return [2 /*return*/, _a.sent()];
                  case 6:
                    if (i + 1 === page) {
                      return [2 /*return*/, body.records];
                    }
                    offset = body.offset;
                    return [3 /*break*/, 8];
                  case 7:
                    err_1 = _a.sent();
                    throw new Error(err_1);
                  case 8:
                    i++;
                    return [3 /*break*/, 1];
                  case 9:
                    return [3 /*break*/, 19];
                  case 10:
                    done = false;
                    _a.label = 11;
                  case 11:
                    if (!!done) return [3 /*break*/, 19];
                    if (offset) {
                      opts.offset = offset;
                    }
                    _a.label = 12;
                  case 12:
                    _a.trys.push([12, 17, , 18]);
                    return [
                      4 /*yield*/,
                      fetch_1.default(url + '?' + buildOpts_1.default(opts), {
                        headers: { Authorization: 'Bearer ' + this.apiKey },
                      }),
                    ];
                  case 13:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                  case 14:
                    body = _a.sent();
                    if (!checkError_1.default(res.status))
                      return [3 /*break*/, 16];
                    if (res.status !== 429) {
                      throw new Error(JSON.stringify(body));
                    }
                    if (!this.retryOnRateLimit) return [3 /*break*/, 16];
                    return [
                      4 /*yield*/,
                      rateLimitHandler_1.default(
                        url + '?' + buildOpts_1.default(opts),
                        {
                          headers: { Authorization: 'Bearer ' + this.apiKey },
                        },
                        this.retryTimeout,
                        this.maxRetry,
                        'records',
                      ),
                    ];
                  case 15:
                    return [2 /*return*/, _a.sent()];
                  case 16:
                    data = data.concat(body.records);
                    offset = body.offset;
                    if (!body.offset) {
                      done = true;
                    }
                    return [3 /*break*/, 18];
                  case 17:
                    err_2 = _a.sent();
                    throw new Error(err_2);
                  case 18:
                    return [3 /*break*/, 11];
                  case 19:
                    return [2 /*return*/, data];
                  case 20:
                    err_3 = _a.sent();
                    throw new Error(err_3);
                  case 21:
                    return [2 /*return*/];
                }
              });
            });
          };
          /**
           * Finds a record on the specified table.
           * @method
           * @param {string} table - Table name
           * @param {string} id - Airtable record ID
           * @returns {Promise<AirtableRecord>}
           */
          this.find = function (table, id) {
            return __awaiter(_this, void 0, void 0, function () {
              var url, res, data, err_4;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    _a.trys.push([0, 5, , 6]);
                    checkArg_1.default(table, 'table', 'string', true);
                    checkArg_1.default(id, 'id', 'string', true);
                    url = baseURL + '/' + this.base + '/' + table + '/' + id;
                    return [
                      4 /*yield*/,
                      fetch_1.default(url, {
                        headers: { Authorization: 'Bearer ' + this.apiKey },
                      }),
                    ];
                  case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                  case 2:
                    data = _a.sent();
                    if (!checkError_1.default(res.status))
                      return [3 /*break*/, 4];
                    if (res.status !== 429) {
                      throw new Error(JSON.stringify(data));
                    }
                    if (!this.retryOnRateLimit) return [3 /*break*/, 4];
                    return [
                      4 /*yield*/,
                      rateLimitHandler_1.default(
                        url,
                        {
                          headers: { Authorization: 'Bearer ' + this.apiKey },
                        },
                        this.retryTimeout,
                        this.maxRetry,
                      ),
                    ];
                  case 3:
                    return [2 /*return*/, _a.sent()];
                  case 4:
                    return [2 /*return*/, data];
                  case 5:
                    err_4 = _a.sent();
                    throw new Error(err_4);
                  case 6:
                    return [2 /*return*/];
                }
              });
            });
          };
          /**
           * Creates a new record on the specified table.
           * @method
           * @param {string} table - Table name
           * @param {Record} record - Record object, used to structure data for insert
           * @returns {Promise<AirtableRecord>}
           */
          this.createRecord = function (table, record) {
            return __awaiter(_this, void 0, void 0, function () {
              var url, body, res, data, err_5;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    _a.trys.push([0, 5, , 6]);
                    checkArg_1.default(table, 'table', 'string', true);
                    checkArg_1.default(record, 'record', 'object', true);
                    url = baseURL + '/' + this.base + '/' + table;
                    body = { fields: record };
                    return [
                      4 /*yield*/,
                      fetch_1.default(url, {
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
                    return [4 /*yield*/, res.json()];
                  case 2:
                    data = _a.sent();
                    if (!checkError_1.default(res.status))
                      return [3 /*break*/, 4];
                    if (res.status !== 429) {
                      throw new Error(JSON.stringify(data));
                    }
                    if (!this.retryOnRateLimit) return [3 /*break*/, 4];
                    return [
                      4 /*yield*/,
                      rateLimitHandler_1.default(
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
                    return [2 /*return*/, _a.sent()];
                  case 4:
                    return [2 /*return*/, data];
                  case 5:
                    err_5 = _a.sent();
                    throw new Error(err_5);
                  case 6:
                    return [2 /*return*/];
                }
              });
            });
          };
          /**
           * Updates a record on the specified table.
           * @method
           * @param {string} table - Table name
           * @param {UpdateRecord} record - Record object, used to update data within a specific record
           * @param {boolean} [destructive=false] - (Dis-)Allow a destructive update
           * @returns {Promise<AirtableRecord>}
           */
          this.updateRecord = function (table, record, destructive) {
            if (destructive === void 0) {
              destructive = false;
            }
            return __awaiter(_this, void 0, void 0, function () {
              var url, fields, res, data, err_6;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    _a.trys.push([0, 5, , 6]);
                    checkArg_1.default(table, 'table', 'string', true);
                    checkArg_1.default(record, 'record', 'object', true);
                    url =
                      baseURL + '/' + this.base + '/' + table + '/' + record.id;
                    fields = record.fields;
                    return [
                      4 /*yield*/,
                      fetch_1.default(url, {
                        method: destructive ? 'put' : 'patch',
                        body: JSON.stringify({ fields: fields }),
                        headers: {
                          Authorization: 'Bearer ' + this.apiKey,
                          'Content-Type': 'application/json',
                        },
                      }),
                    ];
                  case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                  case 2:
                    data = _a.sent();
                    if (!checkError_1.default(res.status))
                      return [3 /*break*/, 4];
                    if (res.status !== 429) {
                      throw new Error(JSON.stringify(data));
                    }
                    if (!this.retryOnRateLimit) return [3 /*break*/, 4];
                    return [
                      4 /*yield*/,
                      rateLimitHandler_1.default(
                        url,
                        {
                          method: destructive ? 'put' : 'patch',
                          body: JSON.stringify({ fields: fields }),
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
                    return [2 /*return*/, _a.sent()];
                  case 4:
                    return [2 /*return*/, data];
                  case 5:
                    err_6 = _a.sent();
                    throw new Error(err_6);
                  case 6:
                    return [2 /*return*/];
                }
              });
            });
          };
          /**
           * Deletes a record from the specified table.
           * @method
           * @param {string} table - Table name
           * @param {string} id - Airtable record ID
           * @returns {Promise<DeleteResponse>}
           */
          this.deleteRecord = function (table, id) {
            return __awaiter(_this, void 0, void 0, function () {
              var url, res, data, err_7;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    _a.trys.push([0, 5, , 6]);
                    checkArg_1.default(table, 'table', 'string', true);
                    checkArg_1.default(id, 'id', 'string', true);
                    url = baseURL + '/' + this.base + '/' + table + '/' + id;
                    return [
                      4 /*yield*/,
                      fetch_1.default(url, {
                        method: 'delete',
                        headers: {
                          Authorization: 'Bearer ' + this.apiKey,
                        },
                      }),
                    ];
                  case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                  case 2:
                    data = _a.sent();
                    if (!checkError_1.default(res.status))
                      return [3 /*break*/, 4];
                    if (res.status !== 429) {
                      throw new Error(JSON.stringify(data));
                    }
                    if (!this.retryOnRateLimit) return [3 /*break*/, 4];
                    return [
                      4 /*yield*/,
                      rateLimitHandler_1.default(
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
                    return [2 /*return*/, _a.sent()];
                  case 4:
                    return [2 /*return*/, data];
                  case 5:
                    err_7 = _a.sent();
                    throw new Error(err_7);
                  case 6:
                    return [2 /*return*/];
                }
              });
            });
          };
          /**
           * Creates multiple new records on the specified table.
           * @method
           * @param {string} table - Table name
           * @param {Array<Record>} records - An array of Record objects
           * @returns {Promise<AirtableRecord[]>}
           */
          this.bulkCreate = function (table, records) {
            return __awaiter(_this, void 0, void 0, function () {
              var url, body, res, data, err_8;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    _a.trys.push([0, 5, , 6]);
                    checkArg_1.default(table, 'table', 'string', true);
                    checkArg_1.default(records, 'records', 'object', true);
                    url = baseURL + '/' + this.base + '/' + table;
                    body = records.map(function (record) {
                      return {
                        fields: record,
                      };
                    });
                    return [
                      4 /*yield*/,
                      fetch_1.default(url, {
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
                    return [4 /*yield*/, res.json()];
                  case 2:
                    data = _a.sent();
                    if (!checkError_1.default(res.status))
                      return [3 /*break*/, 4];
                    if (res.status !== 429) {
                      throw new Error(JSON.stringify(data));
                    }
                    if (!this.retryOnRateLimit) return [3 /*break*/, 4];
                    return [
                      4 /*yield*/,
                      rateLimitHandler_1.default(
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
                    return [2 /*return*/, _a.sent()];
                  case 4:
                    return [2 /*return*/, data.records];
                  case 5:
                    err_8 = _a.sent();
                    throw new Error(err_8);
                  case 6:
                    return [2 /*return*/];
                }
              });
            });
          };
          /**
           * Updates multiple records on the specified table
           * @method
           * @param {string} table - Table name
           * @param {Array<UpdateRecord>} records - An array of Record objects
           * @returns {Promise<AirtableRecord[]>}
           */
          this.bulkUpdate = function (table, records) {
            return __awaiter(_this, void 0, void 0, function () {
              var url, res, data, err_9;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    _a.trys.push([0, 5, , 6]);
                    checkArg_1.default(table, 'table', 'string', true);
                    checkArg_1.default(records, 'records', 'object', true);
                    url = baseURL + '/' + this.base + '/' + table;
                    return [
                      4 /*yield*/,
                      fetch_1.default(url, {
                        method: 'patch',
                        body: JSON.stringify({ records: records }),
                        headers: {
                          Authorization: 'Bearer ' + this.apiKey,
                          'Content-Type': 'application/json',
                        },
                      }),
                    ];
                  case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                  case 2:
                    data = _a.sent();
                    if (!checkError_1.default(res.status))
                      return [3 /*break*/, 4];
                    if (res.status !== 429) {
                      throw new Error(JSON.stringify(data));
                    }
                    if (!this.retryOnRateLimit) return [3 /*break*/, 4];
                    return [
                      4 /*yield*/,
                      rateLimitHandler_1.default(
                        url,
                        {
                          method: 'patch',
                          body: JSON.stringify({ records: records }),
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
                    return [2 /*return*/, _a.sent()];
                  case 4:
                    return [2 /*return*/, data.records];
                  case 5:
                    err_9 = _a.sent();
                    throw new Error(err_9);
                  case 6:
                    return [2 /*return*/];
                }
              });
            });
          };
          /**
           * Deletes multiple records from the specified table
           * @method
           * @param {string} table - Table name
           * @param {Array<string>} ids - Array of Airtable record IDs
           * @returns {Promise<DeleteResponse[]>}
           */
          this.bulkDelete = function (table, ids) {
            return __awaiter(_this, void 0, void 0, function () {
              var query_1, url, res, data, err_10;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    _a.trys.push([0, 5, , 6]);
                    checkArg_1.default(table, 'table', 'string', true);
                    checkArg_1.default(ids, 'ids', 'object', true);
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
                      4 /*yield*/,
                      fetch_1.default(url, {
                        method: 'delete',
                        headers: {
                          Authorization: 'Bearer ' + this.apiKey,
                        },
                      }),
                    ];
                  case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                  case 2:
                    data = _a.sent();
                    if (!checkError_1.default(res.status))
                      return [3 /*break*/, 4];
                    if (res.status !== 429) {
                      throw new Error(JSON.stringify(data));
                    }
                    if (!this.retryOnRateLimit) return [3 /*break*/, 4];
                    return [
                      4 /*yield*/,
                      rateLimitHandler_1.default(
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
                    return [2 /*return*/, _a.sent()];
                  case 4:
                    return [2 /*return*/, data.records];
                  case 5:
                    err_10 = _a.sent();
                    throw new Error(err_10);
                  case 6:
                    return [2 /*return*/];
                }
              });
            });
          };
          /**
           * Checks if a record exists, and if it does updates it, if not creates a new record.
           * @method
           * @param {string} table - Table name
           * @param {string} filterString - The filter formula string used to check for a record
           * @param {Record} record - Record object used to either update or create a record
           * @returns {Promise<AirtableRecord>}
           */
          this.upsertRecord = function (table, filterString, record) {
            return __awaiter(_this, void 0, void 0, function () {
              var exists;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    checkArg_1.default(table, 'table', 'string', true);
                    checkArg_1.default(
                      filterString,
                      'filterString',
                      'string',
                      true,
                    );
                    checkArg_1.default(record, 'record', 'object', true);
                    return [
                      4 /*yield*/,
                      this.select(table, { filterByFormula: filterString }),
                    ];
                  case 1:
                    exists = _a.sent();
                    if (!!exists[0]) return [3 /*break*/, 3];
                    return [4 /*yield*/, this.createRecord(table, record)];
                  case 2:
                    return [2 /*return*/, _a.sent()];
                  case 3:
                    return [
                      4 /*yield*/,
                      this.updateRecord(table, {
                        id: exists[0].id,
                        fields: record,
                      }),
                    ];
                  case 4:
                    return [2 /*return*/, _a.sent()];
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
            (config === null || config === void 0
              ? void 0
              : config.retryTimeout) || 5000;
          this.maxRetry =
            (config === null || config === void 0 ? void 0 : config.maxRetry) ||
            60000;
        }
        return AsyncAirtable;
      })();
      exports.default = AsyncAirtable;
      if (typeof window !== 'undefined') {
        window.AsyncAirtable = AsyncAirtable;
      }

      /***/
    },

    /***/ 934: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, '__esModule', { value: true });
      exports.default = function (opts) {
        var params = Object.keys(opts)
          .map(function (key, i) {
            var opt = opts[key];
            var formatted;
            if (Array.isArray(opt)) {
              formatted = opt
                .map(function (item, j) {
                  switch (typeof item) {
                    case 'object':
                      return Object.keys(item)
                        .map(function (subKey) {
                          return (
                            key + '[' + j + '][' + subKey + ']=' + item[subKey]
                          );
                        })
                        .join('&');
                    case 'string':
                      return key + '[]=' + item;
                  }
                })
                .join('&');
            } else {
              formatted = key + '=' + opt;
            }
            return i !== 0 ? '&' + formatted : formatted;
          })
          .join('');
        return encodeURI(params);
      };

      /***/
    },

    /***/ 202: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, '__esModule', { value: true });
      exports.default = function (arg, name, type, required) {
        if (!arg && required)
          throw new Error('Argument "' + name + '" is required.');
        if (arg && typeof arg !== type)
          throw new Error(
            'Incorrect data type on argument "' +
              name +
              '". Received "' +
              typeof arg +
              '": expected "' +
              type +
              '"',
          );
      };

      /***/
    },

    /***/ 365: /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, '__esModule', { value: true });
      exports.default = function (status) {
        return !(status < 300 && status >= 200);
      };

      /***/
    },

    /***/ 480: /***/ (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) => {
      Object.defineProperty(exports, '__esModule', { value: true });
      var nodeFetch = __webpack_require__(300);
      exports.default =
        typeof window !== 'undefined' ? window.fetch.bind(window) : nodeFetch;

      /***/
    },

    /***/ 595: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) {
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
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
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
      Object.defineProperty(exports, '__esModule', { value: true });
      var fetch_1 = __webpack_require__(480);
      exports.default = function (url, opts, retryTimeout, maxRetry, key) {
        return __awaiter(void 0, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [
              2 /*return*/,
              new Promise(function (resolve, reject) {
                var retryRateLimit = function (
                  url,
                  opts,
                  retryTimeout,
                  maxRetry,
                  key,
                ) {
                  if (maxRetry && maxRetry < 1) {
                    reject('Max timeout exceeded');
                  }
                  setTimeout(function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      var res, data, err_1;
                      return __generator(this, function (_a) {
                        switch (_a.label) {
                          case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, fetch_1.default(url, opts)];
                          case 1:
                            res = _a.sent();
                            return [4 /*yield*/, res.json()];
                          case 2:
                            data = _a.sent();
                            if (res.status === 429) {
                              return [
                                2 /*return*/,
                                retryRateLimit(
                                  url,
                                  opts,
                                  retryTimeout * 1.5,
                                  maxRetry - retryTimeout,
                                  key,
                                ),
                              ];
                            }
                            if (key) {
                              resolve(data[key]);
                            } else {
                              resolve(data);
                            }
                            return [3 /*break*/, 4];
                          case 3:
                            err_1 = _a.sent();
                            reject(err_1);
                            return [3 /*break*/, 4];
                          case 4:
                            return [2 /*return*/];
                        }
                      });
                    });
                  }, retryTimeout);
                };
                retryRateLimit(url, opts, retryTimeout, maxRetry, key);
              }),
            ];
          });
        });
      };

      /***/
    },

    /***/ 300: /***/ (module, exports) => {
      // ref: https://github.com/tc39/proposal-global
      var getGlobal = function () {
        // the only reliable means to get the global object is
        // `Function('return this')()`
        // However, this causes CSP violations in Chrome apps.
        if (typeof self !== 'undefined') {
          return self;
        }
        if (typeof window !== 'undefined') {
          return window;
        }
        if (typeof global !== 'undefined') {
          return global;
        }
        throw new Error('unable to locate global object');
      };

      var global = getGlobal();

      module.exports = exports = global.fetch;

      // Needed for TypeScript and Webpack.
      if (global.fetch) {
        exports.default = global.fetch.bind(global);
      }

      exports.Headers = global.Headers;
      exports.Request = global.Request;
      exports.Response = global.Response;

      /***/
    },

    /******/
  }; // The module cache
  /************************************************************************/
  /******/ /******/ var __webpack_module_cache__ = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ if (__webpack_module_cache__[moduleId]) {
      /******/ return __webpack_module_cache__[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ __webpack_modules__[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__,
    ); // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // startup // Load entry module // This entry module is referenced by other modules so it can't be inlined
  /******/
  /************************************************************************/
  /******/ /******/ /******/ /******/ __webpack_require__(132);
  /******/
})();

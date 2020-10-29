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
exports['default'] = function (
  nodeFetch,
  url,
  opts,
  retryTimeout,
  maxRetry,
  key,
) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [
        2,
        new Promise(function (resolve, reject) {
          var retryRateLimit = function (
            url,
            opts,
            retryTimeout,
            maxRetry,
            key,
          ) {
            if (maxRetry < 1) {
              reject('Max timeout exceeded');
            }
            setTimeout(function () {
              return __awaiter(void 0, void 0, void 0, function () {
                var res, data, err_1;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      _a.trys.push([0, 3, , 4]);
                      return [4, nodeFetch(url, opts)];
                    case 1:
                      res = _a.sent();
                      return [4, res.json()];
                    case 2:
                      data = _a.sent();
                      if (res.status === 429) {
                        return [
                          2,
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
                      return [3, 4];
                    case 3:
                      err_1 = _a.sent();
                      reject(err_1);
                      return [3, 4];
                    case 4:
                      return [2];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0ZUxpbWl0SGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yYXRlTGltaXRIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0JBQWUsVUFBTyxTQUFTLEVBQUUsR0FBVyxFQUFFLElBQUksRUFBRyxZQUFvQixFQUFFLFFBQWdCLEVBQUUsR0FBWTs7UUFDdkcsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO2dCQUNqQyxJQUFNLGNBQWMsR0FBRyxVQUFDLEdBQVcsRUFBRSxJQUFJLEVBQUUsWUFBb0IsRUFBRSxRQUFnQixFQUFFLEdBQVk7b0JBQzdGLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTt3QkFDaEIsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUM7cUJBQ2hDO29CQUNELFVBQVUsQ0FBQzs7Ozs7O29DQUVLLFdBQU0sU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBQTs7b0NBQWhDLEdBQUcsR0FBRyxTQUEwQjtvQ0FDekIsV0FBTSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUE7O29DQUF2QixJQUFJLEdBQUcsU0FBZ0I7b0NBQzdCLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7d0NBQ3RCLFdBQU8sY0FBYyxDQUNuQixHQUFHLEVBQ0gsSUFBSSxFQUNKLFlBQVksR0FBRyxHQUFHLEVBQ2xCLFFBQVEsR0FBRyxZQUFZLEVBQ3ZCLEdBQUcsQ0FDSixFQUFDO3FDQUNIO29DQUNELElBQUksR0FBRyxFQUFFO3dDQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztxQ0FDcEI7eUNBQU07d0NBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3FDQUNmOzs7O29DQUVELE1BQU0sQ0FBQyxLQUFHLENBQUMsQ0FBQzs7Ozs7eUJBRWYsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDbkIsQ0FBQyxDQUFDO2dCQUVGLGNBQWMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDLEVBQUM7O0tBQ0osRUFBQyJ9

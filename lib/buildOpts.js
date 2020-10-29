'use strict';
exports.__esModule = true;
exports['default'] = function (opts) {
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
                    return key + '[' + j + '][' + subKey + ']=' + item[subKey];
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
//# sourceMappingURL=buildOpts.js.map

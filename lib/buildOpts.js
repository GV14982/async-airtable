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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRPcHRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2J1aWxkT3B0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHNCQUFlLFVBQUMsSUFBbUI7SUFDakMsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDN0IsR0FBRyxDQUFDLFVBQUMsR0FBRyxFQUFFLENBQUM7UUFDVixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxTQUFTLENBQUM7UUFDZCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdEIsU0FBUyxHQUFHLEdBQUc7aUJBQ1osR0FBRyxDQUFDLFVBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1gsUUFBUSxPQUFPLElBQUksRUFBRTtvQkFDbkIsS0FBSyxRQUFRO3dCQUNYLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7NkJBQ3JCLEdBQUcsQ0FBQyxVQUFDLE1BQU07NEJBQ1YsT0FBVSxHQUFHLFNBQUksQ0FBQyxVQUFLLE1BQU0sVUFBSyxJQUFJLENBQUMsTUFBTSxDQUFHLENBQUM7d0JBQ25ELENBQUMsQ0FBQzs2QkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2YsS0FBSyxRQUFRO3dCQUNYLE9BQVUsR0FBRyxXQUFNLElBQU0sQ0FBQztpQkFDN0I7WUFDSCxDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2Q7YUFBTTtZQUNMLFNBQVMsR0FBTSxHQUFHLFNBQUksR0FBSyxDQUFDO1NBQzdCO1FBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFJLFNBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQy9DLENBQUMsQ0FBQztTQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNaLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLENBQUMsRUFBQyJ9

'use strict';
exports.__esModule = true;
exports['default'] = function (arg, name, type, required) {
  if (!arg && required) throw new Error('Argument "' + name + '" is required.');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tBcmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2hlY2tBcmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxzQkFBZSxVQUFDLEdBQVEsRUFBRSxJQUFZLEVBQUUsSUFBWSxFQUFFLFFBQWtCO0lBQ3RFLElBQUksQ0FBQyxHQUFHLElBQUksUUFBUTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWEsSUFBSSxvQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pFLElBQUksR0FBRyxJQUFJLE9BQU8sR0FBRyxLQUFLLElBQUk7UUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FDYix1Q0FBb0MsSUFBSSx1QkFBZ0IsT0FBTyxHQUFHLHVCQUFnQixJQUFJLE9BQUcsQ0FDMUYsQ0FBQztBQUNOLENBQUMsRUFBQyJ9

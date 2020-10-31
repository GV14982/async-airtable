'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = (arg, name, type, required) => {
  if (!arg && required) throw new Error(`Argument "${name}" is required.`);
  if (arg && typeof arg !== type)
    throw new Error(
      `Incorrect data type on argument "${name}". Received "${typeof arg}": expected "${type}"`,
    );
};

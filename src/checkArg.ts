import { Arg } from './@types';

export default (
  arg: Arg,
  name: string,
  type: string,
  required = true,
): void => {
  if (arg === undefined && required)
    throw new Error(`Argument "${name}" is required.`);
  if (arg === undefined && !required) return;
  if (typeof arg !== type) {
    if (type === 'array' && Array.isArray(arg)) return;
    throw new Error(
      `Incorrect data type on argument "${name}". Received "${typeof arg}": expected "${type}"`,
    );
  }
};

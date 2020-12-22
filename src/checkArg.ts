import { Arg } from './@types';

export default (
  arg: Arg,
  name: string,
  type: string,
  required?: boolean,
): void => {
  if (!arg && required) throw new Error(`Argument "${name}" is required.`);
  if (arg && typeof arg !== type)
    throw new Error(
      `Incorrect data type on argument "${name}". Received "${typeof arg}": expected "${type}"`,
    );
};

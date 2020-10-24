import { SelectOptions } from "../types/common";

type Arg = string | number | SelectOptions | object[] | string[]

export default (arg: Arg, name: string, type: string, required?: boolean) => {
  if (!arg && required) throw new Error(`Argument "${name}" is required.`);
  if (arg && typeof arg !== type)
    throw new Error(
      `Incorrect data type on argument "${name}". Received "${typeof arg}": expected "${type}"`,
    );
};

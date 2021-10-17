import { BaseFieldType } from './types';

export const booleanHandler = (bool: boolean): string => {
  return bool ? 'TRUE()' : 'FALSE()';
};

export const baseHandler = (val: BaseFieldType): string => {
  if (val === null) {
    return 'BLANK()';
  }
  switch (typeof val) {
    case 'number':
      return `${val}`;
    case 'string':
      return `'${val}'`;
    case 'boolean':
      return booleanHandler(val);
  }
};

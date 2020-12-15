import { SelectOptions } from './@types';

export default (opts: SelectOptions): string => {
  const params = Object.keys(opts)
    .map((key: string, i) => {
      const opt: unknown = opts[key as keyof SelectOptions];
      let formatted;
      if (Array.isArray(opt)) {
        formatted = opt
          .map((item, j) => {
            switch (typeof item) {
              case 'object':
                return Object.keys(item)
                  .map((subKey) => {
                    return `${key}[${j}][${subKey}]=${item[subKey]}`;
                  })
                  .join('&');
              case 'string':
                return `${key}[]=${item}`;
            }
          })
          .join('&');
      } else {
        formatted = `${key}=${opt}`;
      }
      return i !== 0 ? `&${formatted}` : formatted;
    })
    .join('');
  return encodeURI(params);
};

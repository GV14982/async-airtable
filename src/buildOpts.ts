import { SelectOptions } from './types';
import { queryBuilder } from './queryBuilder';

export default (opts: SelectOptions): string => {
  if (
    Object.prototype.hasOwnProperty.call(opts, 'filterByFormula') &&
    Object.prototype.hasOwnProperty.call(opts, 'where')
  )
    throw new Error(
      'Cannot use both where and filterByFormula as they accomplish the same thing',
    );

  const params = Object.keys(opts)
    .map((key: string, i) => {
      /** @todo Find a better type than any for this */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const opt: any = opts[key as keyof SelectOptions];
      let formatted;
      if (Array.isArray(opt)) {
        formatted = opt
          .map((item, j) => {
            switch (typeof item) {
              case 'object':
                return Object.keys(item)
                  .map((subKey) => {
                    return `${encodeURIComponent(
                      `${key}[${j}][${subKey}]`,
                    )}=${encodeURIComponent(item[subKey])}`;
                  })
                  .join('&');
              case 'string':
                return `${encodeURIComponent(key + '[]')}=${encodeURIComponent(
                  item,
                )}`;
            }
          })
          .join('&');
      } else {
        if (key === 'where') {
          formatted = `filterByFormula=${encodeURIComponent(
            queryBuilder(opt),
          )}`;
        } else {
          formatted = `${key}=${encodeURIComponent(opt)}`;
        }
      }
      return i !== 0 ? `&${formatted}` : formatted;
    })
    .join('');
  return params;
};

import { handleError, queryBuilder } from './queryBuilder';
import {
  hasDoubleDateArg,
  isDateAddArg,
  isDateDiffArg,
  isDateFormatArg,
  isDateParseArg,
  isDateSameArg,
  isDateWeekArg,
  isDateWorkDayArg,
  isDateWorkDayDiffArg,
  isStringArray,
  isTextArg,
} from './typeCheckers';
import {
  QueryField,
  DateAddFunc,
  DateDiffFunc,
  DateSameFunc,
  DateFormatFunc,
  DateLastModifiedFunc,
  DateParseFunc,
  DatePastFutureFuncs,
  DateWeekFuncs,
  DateWorkDayDiffFunc,
  DateWorkDayFunc,
  SingleArgDateFuncs,
} from './types';

export const singleArgDateFuncs: SingleArgDateFuncs = {
  $dateStr: (date) => `DATESTR(${queryBuilder(date)})`,
  $day: (date) => `DAY(${queryBuilder(date)})`,
  $hour: (date) => `HOUR(${queryBuilder(date)})`,
  $minute: (date) => `MINUTE(${queryBuilder(date)})`,
  $month: (date) => `MONTH(${queryBuilder(date)})`,
  $second: (date) => `SECOND(${queryBuilder(date)})`,
  $timeStr: (date) => `TIMESTR(${queryBuilder(date)})`,
  $toNow: (date) => `TONOW(${queryBuilder(date)})`,
  $fromNow: (date) => `FROMNOW(${queryBuilder(date)})`,
  $year: (date) => `YEAR(${queryBuilder(date)})`,
};

export const dateAddFunc: DateAddFunc = {
  $dateAdd: ({ date, count, units }) =>
    `DATEADD(${queryBuilder(date)}, ${queryBuilder(count)}, '${units}')`,
};

export const dateDiffFunc: DateDiffFunc = {
  $dateDiff: ({ date1, date2, units }) =>
    `DATETIME_DIFF(${queryBuilder(date1)}, ${queryBuilder(date2)}, '${units}')`,
};

export const dateSameFunc: DateSameFunc = {
  $dateSame: ({ date1, date2, units }) =>
    `IS_SAME(${queryBuilder(date1)}, ${queryBuilder(date2)}${
      units ? ", '" + units + "'" : ''
    })`,
};

export const datePastFutureFuncs: DatePastFutureFuncs = {
  $dateBefore: ({ date1, date2 }) =>
    `IS_BEFORE(${queryBuilder(date1)}, ${queryBuilder(date2)})`,
  $dateAfter: ({ date1, date2 }) =>
    `IS_AFTER(${queryBuilder(date1)}, ${queryBuilder(date2)})`,
};

export const dateFormatFunc: DateFormatFunc = {
  $dateFormat: ({ date, format }) =>
    `DATETIME_FORMAT(${queryBuilder(date)}${
      format ? ", '" + format + "'" : ''
    })`,
};

export const dateParseFunc: DateParseFunc = {
  $dateParse: ({ date, format, locale }) =>
    `DATETIME_PARSE(${queryBuilder(date)}${format ? ", '" + format + "'" : ''}${
      locale ? ", '" + locale + "'" : ''
    })`,
};

export const dateWeekFuncs: DateWeekFuncs = {
  $weekDay: ({ date, start }) =>
    `WEEKDAY(${queryBuilder(date)}${start ? ", '" + start + "'" : ''})`,
  $weekNum: ({ date, start }) =>
    `WEEKNUM(${queryBuilder(date)}${start ? ", '" + start + "'" : ''})`,
};

export const dateWorkDayFunc: DateWorkDayFunc = {
  $workDay: ({ date, numDays, holidays }) =>
    `WORKDAY(${queryBuilder(date)}, ${queryBuilder(numDays)}${
      holidays ? ", '" + holidays.join("', '") + "'" : ''
    })`,
};

export const dateWorkDayDiffFunc: DateWorkDayDiffFunc = {
  $workDayDiff: ({ date1, date2, holidays }) =>
    `WORKDAY_DIFF(${queryBuilder(date1)}, ${queryBuilder(date2)}${
      holidays ? ", '" + holidays.join("', '") + "'" : ''
    })`,
};

export const lastModifiedFunc: DateLastModifiedFunc = {
  $lastModified: (arr) =>
    `LAST_MODIFIED_TIME(${arr.map((field) => '{' + field + '}').join(', ')})`,
};

export const dateFuncs = {
  ...singleArgDateFuncs,
  ...dateAddFunc,
  ...dateDiffFunc,
  ...dateSameFunc,
  ...dateFormatFunc,
  ...dateParseFunc,
  ...datePastFutureFuncs,
  ...dateWeekFuncs,
  ...dateWorkDayDiffFunc,
  ...dateWorkDayFunc,
  ...lastModifiedFunc,
};

export const handleDateFunc = (key: string, val: QueryField): string => {
  if (key in singleArgDateFuncs && isTextArg(val)) {
    return singleArgDateFuncs[key](val);
  } else if (key in dateAddFunc && isDateAddArg(val)) {
    return dateAddFunc[key](val);
  } else if (key in dateDiffFunc && isDateDiffArg(val)) {
    return dateDiffFunc[key](val);
  } else if (key in dateSameFunc && isDateSameArg(val)) {
    return dateSameFunc[key](val);
  } else if (key in dateFormatFunc && isDateFormatArg(val)) {
    return dateFormatFunc[key](val);
  } else if (key in dateParseFunc && isDateParseArg(val)) {
    return dateParseFunc[key](val);
  } else if (key in datePastFutureFuncs && hasDoubleDateArg(val)) {
    return datePastFutureFuncs[key](val);
  } else if (key in dateWeekFuncs && isDateWeekArg(val)) {
    return dateWeekFuncs[key](val);
  } else if (key in dateWorkDayDiffFunc && isDateWorkDayDiffArg(val)) {
    return dateWorkDayDiffFunc[key](val);
  } else if (key in dateWorkDayFunc && isDateWorkDayArg(val)) {
    return dateWorkDayFunc[key](val);
  } else if (key in lastModifiedFunc && isStringArray(val)) {
    return lastModifiedFunc[key](val);
  }
  throw handleError({ key, val });
};

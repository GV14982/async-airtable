import {
  QueryObject,
  QueryField,
  JoinArgs,
  TextSearchArgs,
  FieldNameObject,
  UncheckedArray,
  BaseFieldType,
  IfArgs,
  TextReplaceArgs,
  TextSubArgs,
  TextMidArgs,
  TextDoubleArg,
  SwitchArgs,
  RegexArgs,
  RegexReplaceArgs,
  TextArg,
  NumArg,
  BoolArg,
  AddArg,
  DiffArg,
  FormatArg,
  ParseArg,
  WeekArg,
  WorkDayArg,
  WorkDayDiffArg,
  DoubleDateObj,
} from './types';
import {
  CeilFloorArg,
  LogArg,
  ModArg,
  PowerArg,
  RoundArg,
} from './types/queryBuilder/numeric';

const checkProperty = (
  obj: QueryObject,
  prop: string,
  typeCheck?: (arg: QueryField | undefined) => boolean,
) =>
  Object.prototype.hasOwnProperty.call(obj, prop) &&
  (typeCheck !== undefined ? typeCheck(obj[prop]) : true);

export const isQueryObject = (item: QueryField): item is QueryObject => {
  if (item === undefined) throw new Error('Missing Query Object');
  return item !== null && typeof item === 'object' && !Array.isArray(item);
};

export const isTextArg = (item: QueryField): item is TextArg =>
  isStringOrFieldNameObject(item) || isQueryObject(item);

export const isNumArg = (item: QueryField): item is NumArg =>
  isNumOrFieldNameObject(item) || isQueryObject(item);

export const isBoolArg = (item: QueryField): item is BoolArg =>
  isBoolOrFieldNameObject(item) || isQueryObject(item);

export const isQueryObjectArray = (arr: QueryField): arr is QueryObject[] =>
  arr instanceof Array && arr.every((v: QueryField) => isQueryObject(v));

export const isTextArgArray = (arr: QueryField): arr is TextArg[] =>
  arr instanceof Array && arr.every((v: QueryField) => isTextArg(v));

export const isNumArgArray = (arr: QueryField): arr is NumArg[] =>
  arr instanceof Array && arr.every((v: QueryField) => isNumArg(v));

export const isJoinArgs = (arg: QueryField): arg is JoinArgs =>
  !!(isQueryObject(arg) && arg.val);

export const isFieldNameObject = (val: QueryField): val is FieldNameObject =>
  isQueryObject(val) && typeof val.$fieldName === 'string';

export const isString = (arg: QueryField): arg is string =>
  typeof arg === 'string';

export const isStringArray = (arg: QueryField): arg is string[] =>
  Array.isArray(arg) && arg.every((s) => typeof s === 'string');

export const isStringOrFieldNameObject = (
  val: QueryField,
): val is string | FieldNameObject => isString(val) || isFieldNameObject(val);

export const isNumOrFieldNameObject = (
  val: QueryField,
): val is number | FieldNameObject =>
  typeof val === 'number' || isFieldNameObject(val);

export const isBoolOrFieldNameObject = (
  val: QueryField,
): val is number | FieldNameObject =>
  typeof val === 'boolean' || isFieldNameObject(val);

export const isTextSearchArgs = (arg: QueryField): arg is TextSearchArgs =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'stringToFind', isTextArg) &&
    checkProperty(arg, 'whereToSearch', isTextArg) &&
    (checkProperty(arg, 'index') ? isNumArg(arg.index) : true)
  );

export const isTextReplaceArgs = (arg: QueryField): arg is TextReplaceArgs =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'text', isTextArg) &&
    checkProperty(arg, 'startChar', isNumArg) &&
    checkProperty(arg, 'numChars', isNumArg) &&
    checkProperty(arg, 'replacement', isTextArg)
  );

export const isTextSubArgs = (arg: QueryField): arg is TextSubArgs =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'text', isTextArg) &&
    checkProperty(arg, 'oldText', isTextArg) &&
    checkProperty(arg, 'newText', isTextArg) &&
    (checkProperty(arg, 'index') ? isNumArg(arg.index) : true)
  );
export const isTextMidArgs = (arg: QueryField): arg is TextMidArgs =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'text', isTextArg) &&
    checkProperty(arg, 'whereToStart', isNumArg) &&
    checkProperty(arg, 'num', isNumArg)
  );
export const isTextDoubleArg = (arg: QueryField): arg is TextDoubleArg =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'text', isTextArg) &&
    checkProperty(arg, 'num', isNumArg)
  );

export const allIndexesValid = (arr: UncheckedArray): arr is QueryField[] =>
  arr.every((e) => e !== undefined && e !== null);

export const isBaseField = (item: QueryField): item is BaseFieldType =>
  (typeof item !== 'object' && typeof item !== 'function') || item === null;

export const isIfArgs = (arg: QueryField): arg is IfArgs =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'expression', isBoolArg) &&
    checkProperty(arg, 'ifTrue') &&
    checkProperty(arg, 'ifFalse')
  );

export const isSwitchArgs = (arg: QueryField): arg is SwitchArgs =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'expression', isBoolArg) &&
    checkProperty(arg, 'cases') &&
    arg.cases instanceof Array &&
    arg.cases.every(
      (c) =>
        isQueryObject(c) &&
        checkProperty(c, 'switchCase') &&
        checkProperty(c, 'val'),
    ) &&
    checkProperty(arg, 'defaultVal')
  );

export const isRegexArgs = (arg: QueryField): arg is RegexArgs =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'text', isTextArg) &&
    checkProperty(arg, 'regex', isTextArg)
  );

export const isRegexReplaceArgs = (arg: QueryField): arg is RegexReplaceArgs =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'text', isTextArg) &&
    checkProperty(arg, 'regex', isTextArg) &&
    checkProperty(arg, 'replacement', isTextArg)
  );

export const isCeilFloorArg = (arg: QueryField): arg is CeilFloorArg =>
  !!(isQueryObject(arg) && checkProperty(arg, 'val', isNumArg)) &&
  (checkProperty(arg, 'significance') ? isNumArg(arg.significance) : true);

export const isModArg = (arg: QueryField): arg is ModArg =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'val', isNumArg) &&
    checkProperty(arg, 'divisor', isNumArg)
  );

export const isPowerArg = (arg: QueryField): arg is PowerArg =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'base', isNumArg) &&
    checkProperty(arg, 'power', isNumArg)
  );

export const isRoundArg = (arg: QueryField): arg is RoundArg =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'val', isNumArg) &&
    checkProperty(arg, 'precision', isNumArg)
  );

export const isLogArg = (arg: QueryField): arg is LogArg =>
  !!(isQueryObject(arg) &&
  checkProperty(arg, 'num') &&
  checkProperty(arg, 'base')
    ? isNumArg(arg.base)
    : true);

export const isFunc = (arg: QueryField | (() => string)): arg is () => string =>
  !!(arg && typeof arg === 'function' && typeof arg() === 'string');

export const hasDateArg = (arg: QueryField): arg is QueryObject =>
  !!(isQueryObject(arg) && checkProperty(arg, 'date', isTextArg));

export const hasDoubleDateArg = (arg: QueryField): arg is DoubleDateObj =>
  !!(
    isQueryObject(arg) &&
    checkProperty(arg, 'date1', isTextArg) &&
    checkProperty(arg, 'date2', isTextArg)
  );

export const isDateAddArg = (arg: QueryField): arg is AddArg =>
  !!(
    hasDateArg(arg) &&
    checkProperty(arg, 'count', isNumArg) &&
    checkProperty(arg, 'units', isString)
  );

export const isDateDiffArg = (arg: QueryField): arg is DiffArg =>
  !!(hasDoubleDateArg(arg) && checkProperty(arg, 'units', isString));

export const isDateSameArg = (arg: QueryField): arg is DiffArg =>
  !!(hasDoubleDateArg(arg) && checkProperty(arg, 'units')
    ? isString(arg)
    : true);

export const isDateFormatArg = (arg: QueryField): arg is FormatArg =>
  !!(hasDateArg(arg) && checkProperty(arg, 'format', isTextArg));

export const isDateParseArg = (arg: QueryField): arg is ParseArg =>
  !!(hasDateArg(arg) &&
  (checkProperty(arg, 'format') ? isTextArg(arg.format) : true) &&
  checkProperty(arg, 'locale')
    ? isTextArg(arg.locale)
    : true);

export const isDateWeekArg = (arg: QueryField): arg is WeekArg =>
  !!(hasDateArg(arg) && checkProperty(arg, 'start')
    ? isTextArg(arg.format)
    : true);

export const isDateWorkDayArg = (arg: QueryField): arg is WorkDayArg =>
  !!(hasDateArg(arg) && checkProperty(arg, 'holidays')
    ? isTextArgArray(arg.format)
    : true);

export const isDateWorkDayDiffArg = (arg: QueryField): arg is WorkDayDiffArg =>
  !!(hasDateArg(arg) &&
  checkProperty(arg, 'numDays', isNumArg) &&
  checkProperty(arg, 'holidays')
    ? isTextArgArray(arg.format)
    : true);

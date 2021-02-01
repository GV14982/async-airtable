/**
 * Optional object to pass to the #select method to tailor the response.
 *
 * @example
 * ```
 * {
 *    fields: ['name', 'email', 'date'],
 *    where: {name: 'Paul'},
 *    maxRecords: 50,
 *    pageSize: 10,
 *    sort: [
 *      {
 *        field: "name",
 *        direction: "desc"
 *      },
 *      {
 *        field: "date",
 *        direction: "asc"
 *      }
 *    ],
 *    view: 'Grid view'
 * }
 * ```
 */

export interface SelectOptions {
  /**
   * An array of specific field names to be returned.
   * Returns all fields if none are supplied.
   */
  fields?: string[];
  /**
   * A [formula used](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference)
   * to filter the records to return.
   */
  filterByFormula?: string;
  /**
   * A Query Object used to build a
   * [filter formula](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference)
   * to filter the records to return.
   */
  where?: QueryObject;
  /**
   * @default=100
   * The maximum total number of records that will be returned in your requests.
   * Should be smaller than or equal to `pageSize`
   */
  maxRecords?: number;
  /**
   * @default=100
   * The number of records returned in each request.
   * Must be less than or equal to 100
   */
  pageSize?: number;
  /**
   * A list of sort objects that specifies how the records will be ordered
   */
  sort?: SortObject[];
  /**
   * The name or id of a view on the specified table.
   * If set, only the records in that view will be returned.
   * The records will be sorted according to the order
   * of the view unless the sort parameter is included,
   * which overrides that order. Fields hidden in this view
   * will be returned in the results. To only return
   * a subset of fields, use the fields parameter.
   */
  view?: string;
  /**
   * @ignore
   */
  offset?: string;
}

/**
 * An optional object used to instatiate AsyncAirtable
 *
 * @example
 * ```
 * {
 *    "retryOnRateLimit": true,
 *    "maxRetry": 60000,
 *    "retryTimeout": 5000
 * }
 * ```
 */

export interface Config {
  /**
   * @default=true
   * This decides whether or not the library will
   * handle retrying a request when rate limited
   * */
  retryOnRateLimit?: boolean;
  /**
   * @default=60000
   * The maxmium amount of time before the
   * library will stop retrying and timeout when rate limited
   */
  maxRetry?: number;
  /**
   * @default=5000
   * The starting timeout for the retry. This will get 50%
   * larger with each try until you hit the maxRetry amount
   */
  retryTimeout?: number;
}

/** @ignore */
export type ConfigKey = keyof Config;

/**
 * Sort Option
 * @example
 * ```
 * {
 *    field: "name",
 *    direction: "desc"
 * }
 * ```
 */

export interface SortObject {
  /** The field name you want to sort by */
  field: string;
  /** The direction of the sort */
  direction?: 'asc' | 'desc';
}

/**
 * The response from the #delete and #bulkDelete methods
 *
 * @example
 * ```
 * {
 *   id: "recABCDEFGHIJK",
 *   deleted: true
 * }
 * ```
 */

export interface DeleteResponse {
  /** ID of the deleted record */
  id?: string;
  /** Status if a record was deleted */
  deleted: boolean;
}

/**
 * The record returned by AsyncAirtable
 *
 * @example
 * ```
 * {
 *   id: "recABCDEFGHIJK",
 *   fields: {
 *     title: "hello",
 *     description: "world"
 *   },
 *   createdTime: 'timestamp'
 * }
 * ```
 */

export interface AirtableRecord {
  /** Airtable Record ID */
  id: string;
  /** Object of fields in the record */
  fields: Fields;
  /** Created Timestamp */
  createdTime?: string;
}

/** @ignore */
export interface Fields {
  [key: string]: unknown;
}

/** @ignore */
export interface AirtableRecordResponse {
  records: AirtableRecord[];
  offset?: string;
}

/** @ignore */
export interface AirtableDeletedResponse {
  records: DeleteResponse[];
}
/**
 * The record passed into the #updateRecord and #bulkUpdate methods
 *
 * @example
 * ```
 * {
 *   id: "recABCDEFGHIJK",
 *   fields: {
 *     title: "hello",
 *     description: "world"
 *   }
 * }
 * ```
 */
export interface AirtableUpdateRecord {
  /** The Airtable Record ID of the record you want to update */
  id: string;
  /** Object of fields you want to update in the record */
  fields: Fields;
}

/**
 * An object to handle filtering the records returned by the #select and #upsert methods.
 *
 * @example
 * ```
 * {
 *   id: 'Some ID',
 *   $and: [
 *     {$lte: {count: 10}},
 *     {$gte: {count: 5}}
 *   ],
 *   $or: [
 *     {$neq: {name: 'datboi'}},
 *     {$neq: {name: 'graham'}}
 *   ]
 * }
 * ```
 */
export interface QueryObject {
  /**
   * Less than operator
   *
   * @example
   * ```
   * {$lt: {left: right}}
   * ```
   */
  $lt?: QueryObject;
  /**
   * Greater than operator
   *
   * @example
   * ```
   * {$gt: {left: right}}
   * ```
   */
  $gt?: QueryObject;
  /**
   * Less than or equal operator
   *
   * @example
   * ```
   * {$lte: {left: right}}
   * ```
   */
  $lte?: QueryObject;
  /**
   * Greater than or equal operator
   *
   * @example
   * ```
   * {$gte: {left: right}}
   * ```
   */
  $gte?: QueryObject;
  /**
   * Equal operator
   *
   * @example
   * ```
   * {$eq: {left: right}}
   * ```
   */
  $eq?: QueryObject;
  /**
   * Not equal operator
   *
   * @example
   * ```
   * {$neq: {left: right}}
   * ```
   */
  $neq?: QueryObject;
  /**
   * NOT logical operator
   *
   * @example
   * ```
   * {$not: expression}
   * ```
   */
  $not?: QueryObject;
  /**
   * AND logical operator
   *
   * @example
   * ```
   * {$and: [{expression}, {expression}, ...{expression}]}
   * ```
   */
  $and?: QueryObject[];
  /**
   * OR logical operator
   *
   * @example
   * ```
   * {$or: [{expression}, {expression}, ...{expression}]}
   * ```
   */
  $or?: QueryObject[];
  /**
   * Removes empty strings and null values from the array. Keeps "false" and strings that contain one or more blank characters.
   *
   * @example
   * ```
   * {$arrayCompact: "field name"}
   * ```
   */
  $arrayCompact?: ArrayArg[0];
  /**
   * 	Takes all subarrays and flattens the elements into a single array.
   *
   * @example
   * ```
   * {$arrayFlatten: "field name"}
   * ```
   */
  $arrayFlatten?: ArrayArg[0];
  /**
   * Filters out duplicate array elements.
   *
   * @example
   * ```
   * {$arrayUnique: "field name"}
   * ```
   */
  $arrayUnique?: ArrayArg[0];
  /**
   * 	Joins all array elements into a string with the given separator
   *
   * @example
   * ```
   * {$arrayJoin: ["field name", "separator"]}
   * ```
   * @default separator ","
   */
  $arrayJoin?: ArrayArg;
  /**
   * Finds an occurrence of stringToFind in whereToSearch string starting from an optional startFromPosition.(startFromPosition is 0 by default.) If no occurrence of stringToFind is found, the result will be 0. Similar to SEARCH(), though SEARCH() returns empty rather than 0 if no occurrence of stringToFind is found.
   *
   * @example
   * ```
   * {$textFind: ["test", "This is some test text"]}
   * ```
   */
  $textFind?: TextArg;
  /**
   * Searches for an occurrence of stringToFind in whereToSearch string starting from an optional startFromPosition. (startFromPosition is 0 by default.) If no occurrence of stringToFind is found, the result will be empty. Similar to FIND(), though FIND() returns 0 rather than empty if no occurrence of stringToFind is found.
   *
   * @example
   * ```
   * {$textSearch: ["test", "This is some test text"]}
   * ```
   */
  $textSearch?: TextArg;
  /**
   * Used for handling fieldNames in text methods
   *
   * @example
   * ```
   * {$textFind("text to find", {fieldName: "field to search"})}
   * ```
   */
  $fieldName?: string;
  /**
   * Shortform equal
   *
   * @example
   * ```
   * {field: value}
   * ```
   */
  [key: string]:
    | QueryField
    | QueryField[]
    | QueryObject
    | QueryObject[]
    | ArrayArg[0]
    | ArrayArg
    | TextArg
    | undefined;
}
/** @ignore */
export type ComparisonObject = Record<string, BaseFieldType>;
/** @ignore */
type ComparisonFunction = (vals: ComparisonObject) => string;
/** @ignore */
export interface LogicalOperators extends Record<string, ComparisonFunction> {
  $lt: (vals: ComparisonObject) => string;
  $gt: (vals: ComparisonObject) => string;
  $lte: (vals: ComparisonObject) => string;
  $gte: (vals: ComparisonObject) => string;
  $eq: (vals: ComparisonObject) => string;
  $neq: (vals: ComparisonObject) => string;
}
/** @ignore */
export interface ArrayMethods extends Record<string, ComparisonFunction> {
  $arrayCompact: (vals: ComparisonObject) => string;
  $gt: (vals: ComparisonObject) => string;
  $lte: (vals: ComparisonObject) => string;
  $gte: (vals: ComparisonObject) => string;
}
/** @ignore */
type LogicalFunction =
  | ((expression: QueryObject) => string)
  | ((args: QueryObject[]) => string);
/** @ignore */
export interface LogicalFunctions extends Record<string, LogicalFunction> {
  $not: (expression: QueryObject) => string;
  $and: (args: QueryObject[]) => string;
  $or: (args: QueryObject[]) => string;
}

/** @ignore */
export type QueryField = QueryObject | BaseFieldType;
/** @ignore */
export type BaseFieldType = FieldNameObject | string | number | boolean | null;

/** @ignore */
export type Arg =
  | string
  | number
  | boolean
  | SelectOptions
  | Record<string, unknown>[]
  | string[]
  | AirtableUpdateRecord
  | AirtableUpdateRecord[]
  | undefined;

/** @ignore */
export interface queryBody {
  fields: Fields;
  typecast?: Typecast;
}

/** @ignore */
interface fieldsObject {
  fields: Fields;
}

/** @ignore */
export interface bulkQueryBody {
  records: fieldsObject[] | AirtableRecord[];
  typecast?: Typecast;
}

/**
 * Used for allowing the option to add additional
 * select items when creating or updating a record.
 * Without, it will throw an INVALID_MULTIPLE_CHOICE error if you
 * try to pass an item that doesn't already exist.
 */
export type Typecast = boolean;

/** Options for updating records */
export interface updateOpts {
  /** (Dis-)Allow a destructive update */
  destructive?: boolean;
  /**
   * Used for allowing the ability to add new selections for Select and Multiselect fields.
   */
  typecast?: Typecast;
}

export type ArrayArg = [string, string | undefined];

export type TextArg = [
  string | { $fieldName: string },
  string | { $fieldName: string },
  number | undefined,
];

export type FieldNameObject = {
  $fieldName: string;
};

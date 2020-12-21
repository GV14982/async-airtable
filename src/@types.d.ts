export interface SelectOptions {
  fields?: string[];
  filterByFormula?: string;
  maxRecords?: number;
  pageSize?: number;
  view?: string;
  sort?: SortObject[];
  offset?: string;
}

export interface Config {
  retryOnRateLimit?: boolean;
  maxRetry?: number;
  retryTimeout?: number;
}

export type ConfigKey = keyof Config;

export interface SortObject {
  field: string;
  direction?: 'asc' | 'desc';
}

export interface DeleteResponse {
  id?: string;
  deleted: boolean;
}

export interface AirtableRecord {
  id: string;
  fields: Fields;
  createdTime?: string;
}

export interface Fields {
  [key: string]: unknown;
}

export interface AirtableRecordResponse {
  records: AirtableRecord[];
  offset?: string;
}

export interface AirtableDeletedResponse {
  records: DeleteResponse[];
}

export interface AirtableUpdateRecord {
  id: string;
  fields: Fields;
}

export interface Query {
  where: QueryObject;
}

export interface QueryObject {
  [key: string]: QueryField;
}

type ComparisonObject = Record<string, BaseFieldType>;
type ComparisonFunction = (vals: ComparisonObject) => string;
export interface NumericalOperators extends Record<string, ComparisonFunction> {
  $lt: (vals: ComparisonObject) => string;
  $gt: (vals: ComparisonObject) => string;
  $lte: (vals: ComparisonObject) => string;
  $gte: (vals: ComparisonObject) => string;
  $eq: (vals: ComparisonObject) => string;
  $neq: (vals: ComparisonObject) => string;
}

type LogicalFunction =
  | ((expression: QueryObject) => string)
  | ((args: QueryObject[]) => string);
export interface LogicalOperators extends Record<string, LogicalFunction> {
  $not: (expression: QueryObject) => string;
  $and: (args: QueryObject[]) => string;
  $or: (args: QueryObject[]) => string;
}

export type QueryField = QueryObject | string | number | boolean;
export type BaseFieldType = string | number | boolean | null;

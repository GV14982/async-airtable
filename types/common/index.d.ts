export interface SelectOptions {
  fields?: string[],
  filterByFormula?: string,
  maxRecords?: number,
  pageSize?: number,
  view?: string,
  sort?: SortObject[],
  offset?: string
}

export interface Config {
  retryOnRateLimit: boolean,
  maxRetry: number,
  retryTimeout: number
}

export declare enum Direction {
  Asc = 'asc',
  desc = 'desc'
}

export interface SortObject {
  field: string,
  direction?: Direction
}

export interface DeleteResponse {
  id?: string,
  deleted: boolean
}

export interface AirtableRecord {
  id: string,
  fields: object,
  createdTime: string,
}
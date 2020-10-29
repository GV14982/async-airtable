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
  retryOnRateLimit?: boolean,
  maxRetry?: number,
  retryTimeout?: number
}

export interface SortObject {
  field: string,
  direction?: 'asc' | 'desc'
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
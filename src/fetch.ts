import * as nodeFetch from 'node-fetch';
export default typeof window !== 'undefined'
  ? window.fetch.bind(window)
  : ((nodeFetch as unknown) as typeof fetch);

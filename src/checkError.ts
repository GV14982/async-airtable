export default (status: number): boolean => !(status < 300 && status >= 200);

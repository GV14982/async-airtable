module.exports = function (status) {
  return !(status < 300 && status >= 200);
};

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
require('dotenv').config();

module.exports = {
  setupFiles: ['./setupFile.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  globalSetup: './globalSetup.js',
  globalTeardown: './globalTeardown.js',
  verbose: true,
  testTimeout: parseInt(process.env.RETRY_TIMEOUT),
};

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
require('dotenv').config();

module.exports = {
  setupFiles: ['./setupFile.ts'],
  globalSetup: './globalSetup.ts',
  globalTeardown: './globalTeardown.ts',
  verbose: true,
  testTimeout: parseInt(process.env.RETRY_TIMEOUT),
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
};

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  verbose: true,
  setupFiles: ['./setupFile.js'],
  collectCoverage: true,
  coverageDirectory: 'reports/coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports/jest',
        outputName: 'tests.xml',
      },
    ],
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Test Report',
        outputPath: './reports/jest/tests.html',
        includeConsoleLog: true,
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
  ],
};

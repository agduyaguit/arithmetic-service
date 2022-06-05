import path from 'path';
const rootDirector = path.resolve(__dirname);

export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 50,
      function: 50,
      lines: 50,
      statements: 50,
    },
  },
  globals: {
    'ts-jest': {
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    },
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@server(.*)$': `${rootDirector}/src$1`,
    '@config(.*)$': `${rootDirector}/src/config$1`,
    '@tests(.*)$': `${rootDirector}/__tests__$1`,
    '@controller(.*)$': `${rootDirector}/src/controller$1`,
    '@middleware(.*)$': `${rootDirector}/src/middleware$1`,
  },
  reporters: [
    'default',
    [
      path.resolve(__dirname, 'node_modules', 'jest-html-reporter'),
      {
        pageTitle: 'Arithmetic Service Test Report',
        outputPath: 'test-report.html',
      },
    ],
  ],
  rootDir: rootDirector,
  roots: [rootDirector],
  setupFilesAfterEnv: [`${rootDirector}/src/__tests__/setup.ts`],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/build',
    `${rootDirector}/src/__tests__/fixtures`,
    `${rootDirector}/src/__tests__/setup.ts`,
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: ['((/__tests__/.*)|(\\.|/)(test|spec))\\.tsx?$'],
};
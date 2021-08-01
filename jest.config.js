module.exports = {
  roots: ['./src'],
  testMatch: ['**/*.spec.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '\\.(ts|js)$': ['esbuild-jest'],
  },
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',

    // these libararies have a commonJS version, loading them for testing is faster
    // since this way they don't need to be transpiled
    '^fp-ts/es6/(.*)$': '<rootDir>/node_modules/fp-ts/lib/$1',
    '^io-ts/es6/(.*)$': '<rootDir>/node_modules/io-ts/lib/$1',
    '^validator/es/lib/(.*)$': '<rootDir>/node_modules/validator/lib/$1',
  },
  "transformIgnorePatterns": [
      "node_modules/(?!(functional-fetch/dist)/)" // has no commonJS version, needs to be transpiled
  ],
};

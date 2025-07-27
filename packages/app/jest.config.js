export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.mjs'],
  testTimeout: 60000,
  verbose: true,
  transformIgnorePatterns: [],
  globals: {
    __filename: false,
    __dirname: false
  }
};
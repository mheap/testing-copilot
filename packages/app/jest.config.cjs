module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.js', '**/__tests__/**/*.test.js', '**/__tests__/**/*.spec.ts', '**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: false
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 60000,
  verbose: true
};
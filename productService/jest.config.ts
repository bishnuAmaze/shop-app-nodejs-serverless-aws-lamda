module.exports = {
    roots: ['src'],
    modulePaths: ['src'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    preset: 'ts-jest',
    testMatch: ['**/*.test.ts'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@libs/(.*)$': '<rootDir>/src/libs/$1',
        '^@functions/(.*)$': '<rootDir>/src/functions/$1',
        '^src/(.*)$': '<rootDir>/src/$1',
      },
  };
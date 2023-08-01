module.exports = {
  testEnvironment: 'node',
  verbose: false,
  testRegex: '.test.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

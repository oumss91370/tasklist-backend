/** Configuration Jest pour les tests END-TO-END (HTTP réel via supertest + base SQLite de test). */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test/e2e'],
  testMatch: ['**/*.e2e.ts'],
  globalSetup: '<rootDir>/test/e2e/global-setup.ts',
  setupFiles: ['<rootDir>/test/e2e/env-setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/**/*.test.ts'
  ],
  coverageDirectory: 'coverage-e2e',
  coverageReporters: ['text', 'text-summary', 'lcov'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports', outputName: 'junit-e2e.xml' }]
  ]
};

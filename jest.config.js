/** Configuration Jest pour les tests UNITAIRES (rapides, sans base de données). */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/app.ts',
    '!src/routes/**',
    '!src/lib/prisma.ts',
    '!src/types.ts',
    '!src/**/*.test.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports', outputName: 'junit-unit.xml' }]
  ],
  coverageThreshold: {
    global: { branches: 70, functions: 70, lines: 70, statements: 70 }
  }
};

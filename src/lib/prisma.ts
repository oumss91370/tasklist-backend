/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';

// Sélection du client Prisma selon l'environnement :
//  - en TEST : client SQLite généré depuis prisma/schema-test.prisma ;
//  - sinon   : client MySQL par défaut (@prisma/client).
const isTest = process.env.NODE_ENV === 'test';

const PrismaClient = isTest
  ? require(path.join(__dirname, '..', '..', 'prisma', 'generated', 'test-client')).PrismaClient
  : require('@prisma/client').PrismaClient;

export const prisma = new PrismaClient();

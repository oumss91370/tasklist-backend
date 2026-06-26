import path from 'path';

// Exécuté dans chaque worker AVANT le chargement des tests :
// force l'environnement de test et la base SQLite jetable.
const dbFile = path.resolve(__dirname, '..', '..', 'prisma', 'test.db');
process.env.NODE_ENV = 'test';
process.env.TEST_DATABASE_URL = `file:${dbFile}`;

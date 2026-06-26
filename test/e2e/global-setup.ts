import { execSync } from 'child_process';
import path from 'path';

// Exécuté une seule fois avant toute la suite e2e :
//  1) génère le client Prisma SQLite de test ;
//  2) (re)crée le schéma dans la base SQLite jetable.
export default async function globalSetup(): Promise<void> {
  const root = path.resolve(__dirname, '..', '..');
  const dbFile = path.resolve(root, 'prisma', 'test.db');
  const env = {
    ...process.env,
    NODE_ENV: 'test',
    TEST_DATABASE_URL: `file:${dbFile}`,
  };

  execSync('npx prisma generate --schema=prisma/schema-test.prisma', {
    cwd: root,
    env,
    stdio: 'inherit',
  });

  execSync(
    'npx prisma db push --schema=prisma/schema-test.prisma --skip-generate --force-reset --accept-data-loss',
    { cwd: root, env, stdio: 'inherit' }
  );
}

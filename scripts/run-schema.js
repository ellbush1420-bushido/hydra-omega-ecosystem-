#!/usr/bin/env node

const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const schemaFiles = [
  join(root, 'supabase', 'schema.sql'),
  join(root, 'supabase', 'policies.sql'),
  join(root, 'supabase', 'seed.sql'),
];

for (const file of schemaFiles) {
  if (!existsSync(file)) {
    console.error(`Missing required Supabase file: ${file}`);
    process.exit(1);
  }
}

const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.log('SUPABASE_DB_URL is not set. Schema files exist and were validated only.');
  console.log('Set SUPABASE_DB_URL in GitHub Actions secrets to apply schema automatically.');
  process.exit(0);
}

for (const file of schemaFiles) {
  const sql = readFileSync(file, 'utf8').trim();

  if (!sql) {
    console.log(`Skipping empty SQL file: ${file}`);
    continue;
  }

  console.log(`Applying ${file}`);
  const result = spawnSync('psql', [dbUrl, '--set', 'ON_ERROR_STOP=1', '--file', file], {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    console.error(`Failed to execute psql for ${file}: ${result.error.message}`);
    console.error('Install postgresql-client in CI or run this script from an environment with psql available.');
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`Schema application failed for ${file}`);
    process.exit(result.status || 1);
  }
}

console.log('Supabase schema application complete.');

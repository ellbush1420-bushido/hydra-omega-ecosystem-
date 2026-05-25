#!/usr/bin/env node

const { spawnSync } = require('node:child_process');

const deployCommand = process.env.WORKER_DEPLOY_COMMAND;

if (!deployCommand) {
  console.log('WORKER_DEPLOY_COMMAND is not set. Skipping worker deployment.');
  console.log('Set WORKER_DEPLOY_COMMAND in GitHub Actions secrets to enable deployment.');
  process.exit(0);
}

console.log('Deploying tracking worker...');
const result = spawnSync(deployCommand, {
  shell: true,
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error(`Worker deployment failed to start: ${result.error.message}`);
  process.exit(1);
}

if (result.status !== 0) {
  console.error('Worker deployment failed.');
  process.exit(result.status || 1);
}

console.log('Tracking worker deployment complete.');

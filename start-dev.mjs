#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set environment variables
process.env.NODE_ENV = 'development';

// Windows-specific ESM import fix for Node.js 20+
const nodeOptions = process.env.NODE_OPTIONS || '';
const tsxImport = '--import tsx/esm';

if (!nodeOptions.includes(tsxImport)) {
  process.env.NODE_OPTIONS = nodeOptions ? `${nodeOptions} ${tsxImport}` : tsxImport;
}

// Spawn tsx process
const serverPath = join(__dirname, 'server', 'index.ts');
const child = spawn('npx', ['tsx', serverPath], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

child.on('error', (error) => {
  console.error('Failed to start development server:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

// Handle process termination
process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});
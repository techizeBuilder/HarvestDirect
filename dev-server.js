import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set development environment
process.env.NODE_ENV = 'development';

// Configure Node.js options for different platforms
const isWindows = platform() === 'win32';
let nodeOptions = process.env.NODE_OPTIONS || '';

// Add tsx loader/import for ESM support
if (nodeOptions.indexOf('tsx') === -1) {
  // Use --import for Node.js 20+ or --loader for older versions
  const tsxFlag = '--import tsx/esm';
  nodeOptions = nodeOptions ? `${nodeOptions} ${tsxFlag}` : tsxFlag;
  process.env.NODE_OPTIONS = nodeOptions;
}

// Resolve server path properly for Windows
const serverPath = resolve(__dirname, 'server', 'index.ts');

console.log('Starting development server...');
console.log('Platform:', platform());
console.log('Server path:', serverPath);
console.log('Node options:', nodeOptions);

// Spawn tsx process with proper configuration
const spawnOptions = {
  stdio: 'inherit',
  shell: isWindows,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    NODE_OPTIONS: nodeOptions
  }
};

const child = spawn('npx', ['tsx', serverPath], spawnOptions);

child.on('error', (error) => {
  console.error('Failed to start development server:', error.message);
  
  // Fallback: try running with different configuration
  console.log('Trying alternative startup method...');
  const fallbackChild = spawn('node', ['--import', 'tsx/esm', serverPath], spawnOptions);
  
  fallbackChild.on('error', (fallbackError) => {
    console.error('Fallback also failed:', fallbackError.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure Node.js version is 18+ or 20+');
    console.log('2. Try running: npm install tsx --save-dev');
    console.log('3. Try running: npx tsx server/index.ts directly');
    process.exit(1);
  });
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`Development server killed with signal: ${signal}`);
  } else if (code !== 0) {
    console.log(`Development server exited with code: ${code}`);
  }
  process.exit(code || 0);
});

// Handle process termination gracefully
const cleanup = () => {
  console.log('\nShutting down development server...');
  child.kill('SIGTERM');
  setTimeout(() => {
    child.kill('SIGKILL');
  }, 5000);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
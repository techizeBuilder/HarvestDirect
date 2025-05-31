import { spawn } from 'child_process';
import { platform } from 'os';
import { resolve } from 'path';

// Set environment
process.env.NODE_ENV = 'development';

const isWindows = platform() === 'win32';
const serverPath = resolve(process.cwd(), 'server/index.ts');

console.log(`Platform: ${platform()}`);
console.log(`Starting server from: ${serverPath}`);

// For Node.js 20+, use --import instead of --loader
const nodeArgs = ['--import', 'tsx/esm', serverPath];

const child = spawn('node', nodeArgs, {
  stdio: 'inherit',
  shell: isWindows,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    // Force file URL protocol on Windows
    NODE_OPTIONS: isWindows ? '--experimental-loader tsx/esm' : ''
  }
});

child.on('error', (error) => {
  console.error('Server startup failed:', error.message);
  
  // Try alternative method
  console.log('Trying alternative startup...');
  const fallback = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  fallback.on('error', () => {
    console.error('All startup methods failed. Please check your Node.js installation.');
    process.exit(1);
  });
});

// Handle cleanup
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
#!/usr/bin/env node

import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { resolve, join } from 'path';
import { platform } from 'os';

// Configure environment
process.env.NODE_ENV = 'development';

// Handle Windows-specific path resolution
const isWindows = platform() === 'win32';

async function startServer() {
  try {
    // Import tsx/esm for TypeScript support
    await import('tsx/esm');
    
    // Resolve server path properly for all platforms
    const serverPath = resolve(process.cwd(), 'server', 'index.ts');
    const serverUrl = pathToFileURL(serverPath).href;
    
    console.log(`Starting development server on ${platform()}...`);
    console.log(`Server file: ${serverPath}`);
    
    // Import and run the server
    await import(serverUrl);
    
  } catch (error) {
    console.error('Failed to start server:', error.message);
    
    // Fallback approach
    console.log('Trying fallback method...');
    try {
      const { spawn } = await import('child_process');
      const serverPath = join(process.cwd(), 'server', 'index.ts');
      
      const child = spawn('node', [
        '--loader', 'tsx/esm',
        serverPath
      ], {
        stdio: 'inherit',
        shell: isWindows,
        env: {
          ...process.env,
          NODE_ENV: 'development'
        }
      });
      
      child.on('error', (err) => {
        console.error('Fallback failed:', err.message);
        process.exit(1);
      });
      
    } catch (fallbackError) {
      console.error('All startup methods failed:', fallbackError.message);
      console.log('\nPlease try running: npx tsx server/index.ts');
      process.exit(1);
    }
  }
}

startServer();
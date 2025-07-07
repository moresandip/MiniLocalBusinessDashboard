import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let serverProcess = null;

export const startServer = () => {
  if (serverProcess) {
    console.log('Server is already running');
    return serverProcess;
  }

  console.log('Starting backend server...');
  
  serverProcess = spawn('node', [join(__dirname, 'server.js')], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '3001' }
  });

  serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error);
    serverProcess = null;
  });

  serverProcess.on('exit', (code) => {
    console.log(`Server process exited with code ${code}`);
    serverProcess = null;
  });

  return serverProcess;
};

export const stopServer = () => {
  if (serverProcess) {
    console.log('Stopping backend server...');
    serverProcess.kill();
    serverProcess = null;
  }
};

export const isServerRunning = () => {
  return serverProcess !== null;
};

// Auto-start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT, shutting down gracefully...');
    stopServer();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM, shutting down gracefully...');
    stopServer();
    process.exit(0);
  });
}
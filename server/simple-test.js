import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

async function simpleTest() {
  console.log('🧪 Simple API Test...\n');

  // Start the server
  const server = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Wait for server to start
  await setTimeout(4000);

  try {
    // Test health endpoint
    const healthTest = spawn('curl', ['-s', 'http://localhost:3001/health']);
    
    let healthOutput = '';
    healthTest.stdout.on('data', (data) => {
      healthOutput += data.toString();
    });

    await new Promise((resolve) => {
      healthTest.on('close', resolve);
    });

    console.log('Health endpoint response:', healthOutput);

    // Test validation with invalid data
    const validationTest = spawn('curl', [
      '-s', '-X', 'POST',
      '-H', 'Content-Type: application/json',
      '-d', '{"email":"invalid-email","password":"short"}',
      'http://localhost:3001/api/v1/auth/register'
    ]);
    
    let validationOutput = '';
    validationTest.stdout.on('data', (data) => {
      validationOutput += data.toString();
    });

    await new Promise((resolve) => {
      validationTest.on('close', resolve);
    });

    console.log('Validation test response:', validationOutput);

  } catch (error) {
    console.error('Test error:', error);
  }

  // Clean up
  server.kill();
  console.log('🏁 Test completed');
}

simpleTest().catch(console.error);
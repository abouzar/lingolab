import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

async function debugTest() {
  console.log('🐛 Debug Test...\n');

  // Start the server
  const server = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: ['ignore', 'inherit', 'inherit']  // Show server logs
  });

  // Wait for server to start
  await setTimeout(4000);

  try {
    // Test validation with invalid data
    console.log('Testing invalid email validation...');
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

    console.log('Response:', validationOutput);

  } catch (error) {
    console.error('Test error:', error);
  }

  // Clean up
  server.kill();
  console.log('🏁 Debug test completed');
}

debugTest().catch(console.error);
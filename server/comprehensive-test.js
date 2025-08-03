import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

async function runTest(name, curlArgs) {
  const curl = spawn('curl', curlArgs);
  
  let output = '';
  let error = '';
  
  curl.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  curl.stderr.on('data', (data) => {
    error += data.toString();
  });

  await new Promise((resolve) => {
    curl.on('close', resolve);
  });

  console.log(`\n🧪 ${name}:`);
  if (error) {
    console.log('❌ Error:', error);
  } else {
    try {
      const response = JSON.parse(output);
      console.log('✅ Response:', JSON.stringify(response, null, 2));
    } catch (e) {
      console.log('📄 Raw response:', output);
    }
  }
}

async function comprehensiveTest() {
  console.log('🚀 Starting LingoLab API Comprehensive Test...\n');

  // Start the server
  const server = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Wait for server to start
  await setTimeout(4000);

  const tests = [
    {
      name: 'Health Check',
      args: ['-s', 'http://localhost:3001/health']
    },
    {
      name: 'API Info',
      args: ['-s', 'http://localhost:3001/api']
    },
    {
      name: '404 Test',
      args: ['-s', 'http://localhost:3001/nonexistent']
    },
    {
      name: 'Invalid Email Validation',
      args: [
        '-s', '-X', 'POST',
        '-H', 'Content-Type: application/json',
        '-d', '{"email":"invalid-email","password":"validpassword123","username":"testuser","targetLanguage":"de","nativeLanguage":"en"}',
        'http://localhost:3001/api/v1/auth/register'
      ]
    },
    {
      name: 'Short Password Validation',
      args: [
        '-s', '-X', 'POST',
        '-H', 'Content-Type: application/json',
        '-d', '{"email":"test@example.com","password":"short","username":"testuser","targetLanguage":"de","nativeLanguage":"en"}',
        'http://localhost:3001/api/v1/auth/register'
      ]
    },
    {
      name: 'Missing Fields Validation',
      args: [
        '-s', '-X', 'POST',
        '-H', 'Content-Type: application/json',
        '-d', '{"email":"test@example.com"}',
        'http://localhost:3001/api/v1/auth/register'
      ]
    },
    {
      name: 'Valid Registration (Not Implemented)',
      args: [
        '-s', '-X', 'POST',
        '-H', 'Content-Type: application/json',
        '-d', '{"email":"test@example.com","password":"validpassword123","username":"testuser","targetLanguage":"de","nativeLanguage":"en"}',
        'http://localhost:3001/api/v1/auth/register'
      ]
    },
    {
      name: 'Training Sets Endpoint',
      args: ['-s', 'http://localhost:3001/api/v1/training-sets']
    },
    {
      name: 'AI Chat Endpoint',
      args: [
        '-s', '-X', 'POST',
        '-H', 'Content-Type: application/json',
        '-d', '{"message":"Hello"}',
        'http://localhost:3001/api/v1/ai/chat'
      ]
    }
  ];

  for (const test of tests) {
    try {
      await runTest(test.name, test.args);
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
    }
  }

  // Clean up
  server.kill();
  console.log('\n🏁 Comprehensive test completed');
}

comprehensiveTest().catch(console.error);
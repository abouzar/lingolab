import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

async function testValidation() {
  console.log('🧪 Testing API Validation...\n');

  // Start the server
  const server = spawn('npm', ['run', 'dev:server'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Wait for server to start
  await setTimeout(3000);

  const validationTests = [
    {
      name: 'Invalid email format',
      url: 'http://localhost:3001/api/v1/auth/register',
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'validpassword123',
        username: 'testuser',
        targetLanguage: 'de',
        nativeLanguage: 'en'
      }),
      expectedStatus: 400
    },
    {
      name: 'Short password',
      url: 'http://localhost:3001/api/v1/auth/register',
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'short',
        username: 'testuser',
        targetLanguage: 'de',
        nativeLanguage: 'en'
      }),
      expectedStatus: 400
    },
    {
      name: 'Missing required fields',
      url: 'http://localhost:3001/api/v1/auth/register',
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com'
      }),
      expectedStatus: 400
    },
    {
      name: 'Valid registration data (should return 501)',
      url: 'http://localhost:3001/api/v1/auth/register',
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'validpassword123',
        username: 'testuser',
        targetLanguage: 'de',
        nativeLanguage: 'en'
      }),
      expectedStatus: 501
    }
  ];

  for (const test of validationTests) {
    try {
      const curlArgs = [
        '-s', '-w', '\\nStatus: %{http_code}\\n',
        '-X', test.method,
        '-H', 'Content-Type: application/json',
        '-d', test.body,
        test.url
      ];

      const curl = spawn('curl', curlArgs);
      
      let output = '';
      curl.stdout.on('data', (data) => {
        output += data.toString();
      });

      await new Promise((resolve) => {
        curl.on('close', resolve);
      });

      const statusMatch = output.match(/Status: (\\d+)/);
      const actualStatus = statusMatch ? parseInt(statusMatch[1]) : 0;
      
      const success = actualStatus === test.expectedStatus;
      console.log(`${success ? '✅' : '❌'} ${test.name}:`);
      console.log(`Expected: ${test.expectedStatus}, Got: ${actualStatus}`);
      
      if (output.includes('VALIDATION_ERROR') || output.includes('NOT_IMPLEMENTED')) {
        const jsonMatch = output.match(/^{.*}(?=\\nStatus:)/s);
        if (jsonMatch) {
          const response = JSON.parse(jsonMatch[0]);
          console.log(`Response: ${response.error?.message || response.success}`);
          if (response.error?.details) {
            console.log('Validation errors:', response.error.details.map(d => `${d.field}: ${d.message}`).join(', '));
          }
        }
      }
      console.log('---\n');
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}\n`);
    }
  }

  // Clean up
  server.kill();
  console.log('🏁 Validation test completed');
}

testValidation().catch(console.error);
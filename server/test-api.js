import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

async function testAPI() {
  console.log('🧪 Testing LingoLab API...\n');

  // Start the server
  const server = spawn('npm', ['run', 'dev:server'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Wait for server to start
  await setTimeout(3000);

  const testEndpoints = [
    { url: 'http://localhost:3001/health', description: 'Health check' },
    { url: 'http://localhost:3001/api', description: 'API info' },
    { url: 'http://localhost:3001/api/v1/auth/login', method: 'POST', body: '{"email":"test@example.com","password":"testpass"}', description: 'Auth endpoint (should return 501)' },
    { url: 'http://localhost:3001/api/v1/training-sets', description: 'Training sets endpoint (should return 501)' },
    { url: 'http://localhost:3001/nonexistent', description: '404 handler test' }
  ];

  for (const endpoint of testEndpoints) {
    try {
      const curlArgs = ['-s', '-w', '\\nStatus: %{http_code}\\n'];
      
      if (endpoint.method === 'POST') {
        curlArgs.push('-X', 'POST', '-H', 'Content-Type: application/json', '-d', endpoint.body);
      }
      
      curlArgs.push(endpoint.url);

      const curl = spawn('curl', curlArgs);
      
      let output = '';
      curl.stdout.on('data', (data) => {
        output += data.toString();
      });

      await new Promise((resolve) => {
        curl.on('close', resolve);
      });

      console.log(`✅ ${endpoint.description}:`);
      console.log(output);
      console.log('---\n');
    } catch (error) {
      console.log(`❌ ${endpoint.description}: ${error.message}\n`);
    }
  }

  // Clean up
  server.kill();
  console.log('🏁 API test completed');
}

testAPI().catch(console.error);
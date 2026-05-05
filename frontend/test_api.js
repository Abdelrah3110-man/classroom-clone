import fs from 'fs';
import http from 'http';

const postData = JSON.stringify({
    name: 'Test Fetch',
    email: 'test_fetch' + Date.now() + '@example.com',
    password: 'password123'
});

const options = {
    hostname: '127.0.0.1',
    port: 8080,
    path: '/api/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': 'application/json'
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        fs.writeFileSync('fetch_result.txt', `STATUS: ${res.statusCode}\nHEADERS: ${JSON.stringify(res.headers)}\nBODY: ${data}`);
        console.log('Done!');
    });
});

req.on('error', (e) => {
    fs.writeFileSync('fetch_result.txt', `ERROR: ${e.message}`);
});

req.write(postData);
req.end();

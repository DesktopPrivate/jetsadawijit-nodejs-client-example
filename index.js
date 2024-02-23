const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // Serve the HTML file
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end(`Error loading HTML file: ${err}`);
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    } else if (req.method === 'GET' && req.url === '/styles.css') {
        // Serve the CSS file
        fs.readFile(path.join(__dirname, 'styles.css'), (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end(`Error loading CSS file: ${err}`);
            } else {
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && req.url === '/createFolder') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            const formData = parse(body);
            const folderName = formData.folderName;
            
            const postData = JSON.stringify({ folderName: folderName });

            const options = {
                hostname: 'localhost',
                port: 3000, // Change this port to match your server port
                path: '/createFolder',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
            const req = http.request(options, (res) => {
                console.log(`Status Code: ${res.statusCode}`);
                res.on('data', (chunk) => {
                    console.log(`Response from server: ${chunk}`);
                });
            });

            req.on('error', (error) => {
                console.error(`Error making request: ${error}`);
            });
            
            req.write(postData);
            req.end();
        });
    }
});

const PORT = process.env.PORT || 5000; // Change port to 5000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const http = require('http');
const fs = require('fs');
const path = require('path');

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
        req.on('data', (chunk) => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            const { folderName } = JSON.parse(body);
            if (!folderName) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Folder name cannot be empty');
            } else {
                const folderPath = path.join(__dirname, folderName);
                fs.mkdir(folderPath, (err) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end(`Error creating folder: ${err}`);
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end(`Folder "${folderName}" created successfully`);
                    }
                });
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 5000;
server.listen(5000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

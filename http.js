const http = require('http');

http.createServer(function (req, res) {
  var jsonData = "";
  req.on('data', (chunk) => {
    jsonData += chunk;
  });
  req.on('end', () => {
    res.writeHead(200);
    res.end(jsonData);
  });
}).listen(9000);
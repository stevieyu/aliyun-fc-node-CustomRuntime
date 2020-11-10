const http = require('http');

http.createServer((req, res) => {
	const data = {
		args: {},
		headers: req.headers,
		origin: req.headers['x-forwarded-for'] ||
	        req.connection.remoteAddress ||
	        req.socket.remoteAddress ||
	        req.connection.socket.remoteAddress,
		url: ''
	};
    
    res.writeHead(200, {'Content-Type': 'application/json'});

   
    res.end(new Buffer.from(JSON.stringify(data)));
}).listen(process.env.FC_SERVER_PORT || 9000);
const http = require('http');

const hostname = 'minegame.fr';
const port = 80;

function helloHttp (req, res) {
	response = "This is a sample response from your webhook!"; 


	res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
	res.end(JSON.stringify({ "speech": response, "displayText": response 
		//"speech" is the spoken version of the response, "displayText" is the visual version
	}));
};


const server = http.createServer((req, res) => {
	res.statusCode = 200;
	//res.setHeader('Content-Type', 'text/plain');
	//res.end('Hello World\n');
	helloHttp(req, res);
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});


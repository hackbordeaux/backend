const http = require('http');

const hostname = 'minegame.fr';
const port = 80;
const weatherHost = 'api.openweathermap.org';
const keyApi = '52b05c129e3947a22173de7a3de220e1';

function weatherWebhook(req, res) {
  // Get the city and date from the request
  var city = req.body.result.parameters['geo-city']; // city is a required param
  // Get the date for the weather forecast (if present)
  var date = '';
  if (req.body.result.parameters['date']) {
    date = req.body.result.parameters['date'];
    console.log('Date: ' + date);
  }
  // Call the weather API
  callWeatherApi(city, date).then((output) => {
    // Return the results of the weather API to Dialogflow
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    // If there is an error let the user know
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
};

function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    var path = '/data/2.5/weather?q=' + city + '&APPID=' + keyApi;
    console.log('API Request: ' + host + path);
    // Make the HTTP request to get the weather
    http.get({host: host, path: path}, (res) => {
      var body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        var response = JSON.parse(body);
	var temp = response['main']['temp'];

	var output = `La température dans la ville de ${city} est de ${temp}`;
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}


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
	weatherWebhook(req, res);
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});


const http = require('http');
var express = require('express');
var bodyParser = require('body-parser')

var app = express();

const hostname = '127.0.0.1';
const port = 80;
const weatherHost = 'api.openweathermap.org';
const keyApi = '52b05c129e3947a22173de7a3de220e1';


function weatherWebhook(req, res) {
  if (!req.body.result) {
    return;
  }
  // var city = req.body.result.parameters['geo-city'];
  var city = req.body.result.parameters['geo-city'];
  var date = '';
  if (req.body.result.parameters['date']) {
    date = req.body.result.parameters['date'];
    console.log('Date: ' + date);
  }
  // Call the weather API
  callWeatherApi(city, date).then((output) => {
    res.end(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    res.end(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
};

function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    var path = '/data/2.5/weather?q=' + city + '&APPID=' + keyApi + '&units=metric';
    console.log('API Request: ' + weatherHost + path);
    // Make the HTTP request to get the weather
    host = weatherHost;
    http.get({host: host, path: path}, (res) => {
      var body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        var response = JSON.parse(body);
        var temp = response['main']['temp'];

        var output = `La température dans la ville de ${city} est de ${temp} degrès`;
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


app.use(bodyParser.json())

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/json')
  weatherWebhook(req, res);
})

app.listen(port, () => console.log('Example app listening on port ' + port))
const http = require('http');
var express = require('express');
var bodyParser = require('body-parser')

var app = express();

const hostname = '127.0.0.1';
const port = 80;
const weatherHost = 'api.openweathermap.org';
const keyApi = '52b05c129e3947a22173de7a3de220e1';
const jokeHost = 'api.icndb.com';
const quoteHost = 'quotesondesign.com';


function weatherWebhook(req, res) {
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
        var temp = 0;
        if (response['main'] && response['main']['temp']) {
          var temp = response['main']['temp'];
        }
        

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

function jokeWebhook(req, res) {
  callJokeApi().then((output) => {
    res.end(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    res.end(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
}

function callJokeApi() {
  return new Promise((resolve, reject) => {
    console.log('Call Quote');
    host = jokeHost;
    let path = '/jokes/random';
    console.log('API Request: ' + host + path);
    http.get({host: host, path: path}, (res) => {
      var body = '';
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        var response = JSON.parse(body);
        let output = '';
        if (response['value'] && response['value']['joke']) {
          output = response['value']['joke'];
        }

        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      })
    })
  });
}

function callQuoteApi() {
  return new Promise((resolve, reject) => {
    console.log('Call quote');
    host = quoteHost;
    let path = '/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=';
    console.log('API Request: ' + host + path);
    http.get({host: host, path: path}, (res) => {
      var body = '';
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        var response = JSON.parse(body);
        let output = '';
        if (response[0] && response[0]['title'] && response[0]['content']) {
          const author = response[0]['title'];
          const content = response[0]['content'];
          output = "*" + content + "* de " + author;
        }

        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      })
    })
  });
}

function quoteWebhook(req, res) {
  callQuoteApi().then((output) => {
    res.end(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    res.end(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
}

app.use(bodyParser.json())

app.use(function (req, res) {
  console.log(JSON.stringify(req.body));
  res.setHeader('Content-Type', 'text/json')

  if (req.body.result && req.body.result.metadata) {
    if (req.body.result.metadata.intentId === "ed921f35-b665-4a01-b830-d31fba3c529c") {
      weatherWebhook(req, res);
    }

    if (req.body.result.metadata.intentId === "b099578a-d93a-4c6d-bc88-092991b4430b" ||
      req.body.result.metadata.intentId === "ac9ae09a-1649-4ffb-afe1-2729c95210bd") {
      jokeWebhook(req, res);
    }

    if (req.body.result.metadata.intentId === "555335ef-bb6a-4529-b4ae-a184d3847aac") {
      quoteWebhook(req, res);
    }
  }
  
})

app.listen(port, () => console.log('Example app listening on port ' + port))
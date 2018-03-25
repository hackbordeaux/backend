const http = require('http');
var express = require('express');
var bodyParser = require('body-parser')

var app = express();

const hostname = '127.0.0.1';
const port = 80;
const weatherHost = 'api.worldweatheronline.com';
const keyApi = '52b05c129e3947a22173de7a3de220e1';
const jokeHost = 'api.icndb.com';
const quoteHost = 'quotesondesign.com';
const newHost = "newsapi.org";
const twitterHost = "api.twitter.com";
const slackHost = "slack.com";


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
    let path = '/premium/v1/weather.ashx?key=45feb3b05fe348c892e20849182503&q=' + city + '&format=json&num_of_days=1&lang=fr';
    if (date) {
      path += '&date=' + date;
    }
    console.log('API Request: ' + weatherHost + path);
    // Make the HTTP request to get the weather
    host = weatherHost;
    http.get({host: host, path: path}, (res) => {
      var body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        var response = JSON.parse(body);
        var tempMax = 0;
        let tempMin = 0;
        if (response.data.weather && response.data.weather[0].maxtempC) {
          tempMax = response.data.weather[0].maxtempC;
          tempMin = response.data.weather[0].mintempC;
        }
        

        var output = `La température dans la ville de ${city} est de minimum ${tempMin} degrès et maximum ${tempMax} degrès`;
        if (date) {
          output = `La température le ${date} dans la ville ${city} est de minimum ${tempMin} degrès et maximum ${tempMax} degrès`;
        }
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
    console.log('Call Joke');
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
          output = content + " de " + author;
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

function callNewsApi(number, category) {
  return new Promise((resolve, reject) => {
    console.log('Call news');
    host = newHost;
    let path = '/v2/top-headlines?country=fr&apiKey=5fdc70d402c342f0b3401c51f6ada579&pageSize=' + number;
    if (category != '') {
      path += "&category=" + category;
    }
    console.log('API Request: ' + host + path);
    http.get({host: host, path: path}, (res) => {
      var body = '';
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        var response = JSON.parse(body);
        let output = '';
        if (response.articles) {
          response.articles.forEach(element => {
            output += element.title + "\n" + element.url + " \n \n";
          });
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

function newsWebhook(req, res) {

  let category = '';
  let number = 3;
  if (req.body.result.parameters.number) {
    number = req.body.result.parameters.number;
  }
  if (req.body.result.parameters.categoryNews) {
    category = req.body.result.parameters.categoryNews;
  }

  callNewsApi(number, category).then((output) => {
    res.end(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    res.end(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
}


function callDefisApi(number, category) {
  return new Promise((resolve, reject) => {
    console.log('Call news');
    host = slackHost;
    let path = '/api/conversations.members?token=xoxp-335013515025-335526524532-334933579312-df65f7d326db3f120d9e9c16ac7b684c&channel=C9UQK8H24&pretty=1';

    console.log('API Request: ' + host + path);
    http.get({host: host, path: path}, (res) => {
      var body = '';
      res.on('data', (d) => {
        body += d;
      }); // store each response chunk
      res.on('end', () => {
        var response = JSON.parse(body);
        let output = '';
        if (response.members) {
          const lenght = response.members.lenght();
          const data = response.members[Math.floor(Math.random() * Math.floor(lenght-1))];
          
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

function defisWebhook(req, res) {
  app.use(bodyParser.urlencoded({extended: false}));
  res.setHeader('Content-Type', 'text/x-www-form-urlencoded')
  callDefisApi().then((output) => {
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
    if (req.body.result.metadata.intentId === "ed921f35-b665-4a01-b830-d31fba3c529c" ||
      req.body.result.metadata.intentId === "6d468769-6fad-4192-b2ac-45ed5fcfed4b" ||
      req.body.result.metadata.intentId === "ae1e6c83-0d98-4031-aea9-bd9befc1565d") {
      weatherWebhook(req, res);
    }

    else if (req.body.result.metadata.intentId === "b099578a-d93a-4c6d-bc88-092991b4430b" ||
      req.body.result.metadata.intentId === "ac9ae09a-1649-4ffb-afe1-2729c95210bd") {
      jokeWebhook(req, res);
    }

    else if (req.body.result.metadata.intentId === "555335ef-bb6a-4529-b4ae-a184d3847aac" ||
      req.body.result.metadata.intentId === "44b8ba66-e066-44f0-b7bf-247ace7066e4") {
      quoteWebhook(req, res);
    }

    else if (req.body.result.metadata.intentId === "5047edb6-8d62-4d91-b302-c22c43b13aae") {
      newsWebhook(req, res);
    }

    else if (req.body.result.metadata.intentId === "51b0637e-c1ef-445d-8974-58a0f9fca9b3") {
      defisWebhook(req, res);
    }
  }
  
})

app.listen(port, () => console.log('Example app listening on port ' + port))
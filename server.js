const request = require('request');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 1337;

app.set('port', PORT);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.post('/location', function(req, res) {
  const URL = `http://api.brewerydb.com/v2/search/geo/point?radius=100&lat=${req.body.latitude}&lng=${req.body.longitude}&key=a3112121a853b5030fb64addbc45e14a`;
  console.log(req.body.latitude, req.body.longitude)

  request(URL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(JSON.parse(body));
    }
  })

});

app.listen(app.get('port'), () => console.log('Server started: http://localhost:' + app.get('port') + '/'));

var request = require('request');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.set('port', (process.env.PORT || 3000));

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
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const URL = `http://api.brewerydb.com/v2/search/geo/point?radius=25&lat=${latitude}&lng=${longitude}&key=a3112121a853b5030fb64addbc45e14a`;
  console.log(latitude, longitude)

  request(URL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      console.log(info)
      res.send(info);
    }
  })


});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

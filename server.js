var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//var COMMENTS_FILE = path.join(__dirname, 'comments.json');

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

// http://api.brewerydb.com/v2/search/geo/point?radius=25&lat=30.2687782&lng=-97.7411321&key=a3112121a853b5030fb64addbc45e14a

// app.get('/api/comments', function(req, res) {
//   $.ajax({
//     url: `http://api.brewerydb.com/v2/search/geo/point?radius=25&lat=${this.state.latitude}&lng=${this.state.longitude}&key=a3112121a853b5030fb64addbc45e14a&callback=JSON_CALLBACK`,
//     dataType: 'json',
//     cache: false,
//     success: (Data) => {
//       console.log("DATA", Data)
//       res.json(Data.data);
//     },
//     error: err => console.log(err)
//   });
// });


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

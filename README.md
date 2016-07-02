There's a lot of good advice in this thread. I built a bare-bones React/Node example app that deploys to Heroku here: [https://github.com/alanbsmith/react-node-example](https://github.com/alanbsmith/react-node-example)

Major points:

- you need a server for production to serve your static content to the browser. I would recommend Express because it's really simple. Check out 

server.js in that example.
- you will need to tell your app to listen on a port designated by Heroku when in production in your server file: 

var PORT = process.env.PORT || 8080
- you'll want a 

postinstall script to compile all your JS/JSX/etc. Look at the postinstall script in

package.json
- you'll probably want a way to uglify your JS in production and you'll need a separate webpack config file for that. See 

webpack.prod.config.js

Hope that helps. Ping me if you have questions.

var express = require('express');
var app = express();
var server = require('http').createServer(app);

require('./utils.js');
require('./console.js');
require('./socket_listener.js');
require('./logger.js');


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public'));
app.use(function(req, res){
  res.render('404.html', 404);
});

Console.enable();
socketServer = new SocketServer(server);


server.listen(80);
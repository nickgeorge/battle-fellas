SocketServer = function(server) {
  var listener = require('socket.io').listen(server);
  listener.set('log level', 2);

  this.sockets = listener.sockets;
  this.clients = [];

  this.sockets.on('connection',
      bind(this.connectionHandler, this));
};

SocketServer.prototype.connectionHandler = function(socket) {
  Logger.info('Connection made.');
  socket.on('m', bind(this.broadcast, this));
  socket.on('disconnect', 
      bind(this.disconnectHandler, this, socket));
  this.clients.push(socket);
};

SocketServer.prototype.disconnectHandler = function(socket) {
  Logger.info('Socket ' + socket.id + ' disconnected.\n' + 
      'Sockets remaining: ' + this.clients.length);
  this.clients.remove(socket);
};

SocketServer.prototype.broadcast = function(msg) {
  for (var i = 0, client; client = this.clients[i]; i++) {
    client.emit('bc', msg);
  }
};
SocketListener = function(server) {
  this.io = require('socket.io').listen(server);
  this.io.set('log level', 2);

  this.sockets = this.io.sockets;
  this.clients = [];

  this.sockets.on('connection',
      bind(this.connectionHandler, this));
};

SocketListener.prototype.connectionHandler = function(socket) {
  Logger.info('Connection made.');
  socket.on('m', bind(this.broadcast, this));
  socket.on('disconnect', 
      bind(this.disconnectHandler, this, socket));
  this.clients.push(socket);
};

SocketListener.prototype.disconnectHandler = function(socket) {
  Logger.info('Socket ' + socket.id + ' disconnected.\n' + 
      'Sockets remaining: ' + this.clients.length);
  this.clients.remove(socket);
};

SocketListener.prototype.broadcast = function(msg) {
  for (var i = 0, client; client = this.clients[i]; i++) {
    client.emit('bc', msg);
  }
};
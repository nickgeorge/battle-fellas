Client = function() {
  this.socket = io.connect('/');
  this.on('bc', function (data) {
    console.log(data);
  });
};

Client.prototype.on = function(type, handler) {
  this.socket.on(type, handler);
};

Client.prototype.emit = function(type, msg) {
  this.socket.emit(type, msg);
};

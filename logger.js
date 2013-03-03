var red   = '\u001b[31m';
var blue  = '\u001b[34m';
var cyan  = '\u001b[36m';
var reset = '\u001b[0m';

var log = function(word, color, msg) {
  var nl = '\n';
  var spaces = 5 + word.length;
  for (var i = 0; i < spaces; i++) {
    nl += ' ';
  }
  nl += '- ';
  Console.write('   ' + color + word + reset +
      '  - ' + msg.replace(/\n/g, nl));
};

Logger = {
  info: bind(log, this, 'info', cyan),
  warning: bind(log, this, 'warning', blue),
  error: bind(log, this, 'error', red)
};

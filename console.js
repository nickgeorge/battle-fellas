Console = {
  enable: function() {
    process.stdin.setEncoding('utf8');
    process.stdin.resume();
    process.stdin.on('data', this.processCommand);
    Console.writePrompt();
  },

  processCommand: function(command) {
    command = command.trim();
    if (command) {
      try {
        var response = eval(command);
        response && Console.log(response);
      } catch(e) {
        Console.log(e);
      }
    }
  },

  writePrompt: function() {
    process.stdout.write('>');
  },

  write: function(txt) {
    process.stdout.write(txt.toString() + '\n');
  },

  log: function(txt) {
    Console.write(txt)
    Console.writePrompt();
  }
};
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
        var response = eval(command.trim());
        response && process.stdout.write(response.toString() + '\n');
      } catch(e) {
        process.stdout.write(e.toString() + '\n');
      }
    }
    Console.writePrompt();
  },

  writePrompt: function() {
    process.stdout.write('>');
  },

  write: function(txt) {
    process.stdout.write(txt + '\n');
  },

  log: function(txt) {
    this.write(txt)
    this.writePrompt();
  }
};
Console = {
  enable: function() {
    process.stdin.setEncoding('utf8');
    process.stdin.resume();
    process.stdin.on('data',  bind(this.processCommand, this));
    this.writePrompt();
  },

  processCommand: function(command) {
    command = command.trim();
    if (command) {
      try {
        var response = eval(command);
        response && this.log(response);
      } catch(e) {
        this.log(e);
      }
    } else {
      this.writePrompt();
    }
  },

  writePrompt: function() {
    process.stdout.write('>');
  },

  write: function(txt) {
    process.stdout.write(txt.toString() + '\n');
  },

  log: function(txt) {
    this.write(txt)
    this.writePrompt();
  }
};
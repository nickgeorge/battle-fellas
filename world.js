World = function() {
  this.things = [];
  this.projectiles = [];
  this.effects = [];
  this.lights = [];
  this.theta = 0;
  this.rotSpeed = 0;
  this.board = null;
  this.G = 30;

  this.thingsToRemove = [];
  this.effectsToRemove = [];
};

World.prototype.add = function(thing) {
  this.things.push(thing);
};

World.prototype.draw = function() {
  mat4.rotate(gl.mvMatrix, this.theta, [0, 0, 1]);
  this.board.draw();
  this.things.apply("draw");
  this.projectiles.apply("draw");
  this.effects.apply("draw");
};

World.prototype.advance = function(dt) {
  this.addAndRemoveThings();
  this.theta += this.rotSpeed * dt;
  this.things.apply("advance", [dt]);
  this.projectiles.apply("advance", [dt]);
  this.effects.apply("advance", [dt]);
  this.checkCollisions();

  while (this.projectiles.length > 100) this.projectiles.shift();
  while (this.effects.length > 200) this.effects.shift();
};

World.prototype.addLight = function(light) {
  this.lights.push(light);
};

World.prototype.applyLights = function() {
  for (var i = 0, light; light = this.lights[i]; i++) {
    light.apply();
  }
};

World.prototype.populate = function() {
  var light = new Light();
  light.setDirection([0, -.5, -1]);
  light.setAmbientColor([.2, .2, .2]);
  light.setDirectionalColor([.8, .8, .8]);
  world.addLight(light);

  var numFellas = 10;
  var numCrates = 0;

  this.board = new Box([200, 100, 1]).
      setColor([.5, .5, .5]).
      setPosition([0, 0, -.5]);

  for (var i = 0; i < numFellas; i++) {
    world.add(new Fella([      
      Math.random()*world.board.size[0] + world.board.min(0),
      Math.random()*world.board.size[1] + world.board.min(1),
      0
    ]).setTheta(i*Math.PI*2/numFellas));
  }
  for (var i = 0; i < numCrates; i++) {
    world.add(new Box([1, 1, 1]).
        setTheta(Math.random() * Math.PI*2).
        setPosition([
          Math.random()*world.board.size[0] + world.board.min(0),
          Math.random()*world.board.size[1] + world.board.min(1),
          5 + Math.random()*10 + world.board.max(2)
        ]).
        setColor([0, 1, 0]));
  }
};

World.prototype.inBounds = function(xyz) {
  return Math.abs(xyz[0]) < world.board.max(0) 
      && Math.abs(xyz[1]) < world.board.max(1);
};

World.prototype.addAndRemoveThings = function() {
  for (var i = 0, thing; thing = this.thingsToRemove[i]; i++) {
    this.things.remove(thing);
    thing = null;
  }
  for (var i = 0, effect; effect = this.effectsToRemove[i]; i++) {
    this.effects.remove(effect);
    effect = null;
  }
  this.effectsToRemove = [];
};

World.prototype.checkCollisions = function() {
  for (var i = 0, projectile; projectile = this.projectiles[i]; i++) {
    for (var j = 0, thing; thing = this.things[j]; j++) {
      if (projectile.parent == thing) continue;
      var d_x = thing.position[0] - projectile.position[0];
      var d_y = thing.position[1] - projectile.position[1];
      var d_z = thing.position[2]+1.5 - projectile.position[2];
      if (d_x < 2 && d_y < 2 && d_z < 2) {
        var d2 = d_x*d_x + d_y*d_y + d_z*d_z;

        if (d2 < 1) {
          thing.alive && world.add(new Fella([1, 1, 1]).
              setTheta(Math.random() * Math.PI*2).
              setPosition([
                Math.random()*world.board.size[0] + world.board.min(0),
                Math.random()*world.board.size[1] + world.board.min(1),
                0
              ]));
          thing.die();
          

        }
      } 
    }
  }
};
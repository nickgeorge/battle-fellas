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
  this.effects.apply("draw");
  this.projectiles.apply("draw");
  this.things.apply("draw");
};

World.prototype.advance = function(dt) {
  this.addAndRemoveThings();
  this.theta += this.rotSpeed * dt;
  this.things.apply("advance", [dt]);
  this.projectiles.apply("advance", [dt]);
  this.effects.apply("advance", [dt]);
  this.checkCollisions();

  while (this.projectiles.length > 200) this.projectiles.shift().dispose();
  while (this.effects.length > 200) this.effects.shift().dispose();
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
  this.addLight(light);

  var numFellas = 25;
  var numCrates = 10;

  this.board = new Box([100, 200, 1]).
      setColor([1, 1, 1]).
      setPosition([0, 0, -.5]).
      setTexture(Media.TEXTURES.GRASS).
      createTextureBuffer({
        top: [0, 15, 0, 30]
      });

  for (var i = 0; i < numFellas; i++) {
    this.add(new Fella([      
      Math.random()*this.board.size[0] + this.board.min(0),
      Math.random()*this.board.size[1] + this.board.min(1),
      0
    ]).setTheta(i*Math.PI*2/numFellas));
  }
  for (var i = 0; i < numCrates; i++) {
    this.add(new Box([1, 1, 1]).
        setTheta(Math.random() * Math.PI*2).
        setPosition([
          Math.random()*this.board.size[0] + this.board.min(0),
          Math.random()*this.board.size[1] + this.board.min(1),
          5 + Math.random()*10 + this.board.max(2)
        ]).
        setColor([1, 1, 1]).
        setTexture(Media.TEXTURES.CRATE, true));
  }
};

World.prototype.inBounds = function(xyz) {
  return Math.abs(xyz[0]) < this.board.max(0) 
      && Math.abs(xyz[1]) < this.board.max(1);
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
      var d_z = thing.position[2]+(thing.constructor == Fella ? 1.5 : 0) - projectile.position[2];
      if (d_x < 2 && d_y < 2 && d_z < 2) {
        var d2 = d_x*d_x + d_y*d_y + d_z*d_z;

        if (d2 < 1) {
          if (thing.alive) {
            thing.die();

            if (thing.constructor == Fella) {
              this.effects.push(new DoubleExplosion(.25, [1, 1, 0], [1, 1, 1]).
                  setPosition(projectile.position));
              this.add(new Fella().
                setTheta(Math.random() * Math.PI*2).
                setPosition([
                  Math.random()*this.board.size[0] + this.board.min(0),
                  Math.random()*this.board.size[1] + this.board.min(1),
                  0
                ]));
            }
            if (thing.constructor == Box) {
              this.effects.push(new DoubleExplosion(1).
                  setPosition(thing.position));
              this.add(new Box([1, 1, 1]).
                setTheta(Math.random() * Math.PI*2).        
                setColor([1, 1, 1]).
                setTexture(Media.TEXTURES.CRATE, true).
                setPosition([
                  Math.random()*this.board.size[0] + this.board.min(0),
                  Math.random()*this.board.size[1] + this.board.min(1),
                  Math.random()*10 + 10
                ]));              
            }
          }
        }
      } 
    }
  }
};